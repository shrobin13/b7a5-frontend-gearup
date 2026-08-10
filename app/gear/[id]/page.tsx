"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, Store } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getGearById } from "@/services/gear";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPayment } from "@/services/payment";
import { createRental, getMyRentals } from "@/services/customer";
import { createReview, getGearReviews } from "@/services/reviews";
import { useAuthStore } from "@/store/auth-store";
import type { Review } from "@/types";
import { toast } from "sonner";
import { format, startOfToday } from "date-fns";
import { Input } from "@/components/ui/input";
import { getCategoryName } from "@/lib/utils";

const SERVICE_FEE = 12;

export default function GearDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [gear, setGear] = useState<{
    id: string;
    _id?: string;
    name: string;
    category: string;
    price: number;
    rating: number;
    available: boolean;
    description: string;
    stock: number;
    brand?: string;
    image?: string;
    images?: string[];
  } | null>(null);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [providerName, setProviderName] = useState<string | undefined>(undefined);
  const [hasReturnedRental, setHasReturnedRental] = useState(false);

  const id = params?.id;

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadGear = async () => {
      try {
        const item = await getGearById(id);

        if (!item) {
          setGear(null);
          setReviews([]);
          return;
        }

        const gearId = item.id ?? item._id ?? id;
        const stockValue = Number(item.stockQuantity ?? item.stock ?? 0);
        const imageUrls = Array.isArray(item.images)
          ? item.images.filter((url): url is string => typeof url === "string" && Boolean(url.trim()))
          : typeof item.image === "string" && item.image.trim()
            ? [item.image.trim()]
            : [];
        setGear({
          id: gearId,
          _id: item._id ?? item.id ?? id,
          name: item.name,
          category: getCategoryName(item.category),
          price: Number(item.pricePerDay ?? 0),
          rating: Number(item.rating ?? 0),
          available: Boolean(item.isAvailable ?? stockValue > 0),
          description: item.description ?? "No description available.",
          stock: stockValue,
          brand: typeof item.brand === "string" && item.brand.trim() ? item.brand.trim() : undefined,
          image: imageUrls[0],
          images: imageUrls,
        });
        setActiveImage(imageUrls[0]);

        const rawPayload = item as { provider?: { name?: string } };
        setProviderName(
          typeof rawPayload.provider?.name === "string" && rawPayload.provider.name.trim()
            ? rawPayload.provider.name.trim()
            : undefined
        );

        try {
          const nextReviews = await getGearReviews(gearId);
          setReviews(Array.isArray(nextReviews) ? nextReviews : []);
        } catch {
          setReviews([]);
        }

        if (isAuthenticated) {
          try {
            const myRentals = await getMyRentals();
            const rentals = Array.isArray(myRentals) ? myRentals : [];
            const bookedDates = rentals
              .filter((rental) => {
                const gearItem = (rental as { items?: { gearItem?: { id?: string; _id?: string } }[] }).items?.[0]?.gearItem;
                return gearItem?.id === gearId || gearItem?._id === gearId;
              })
              .flatMap((rental) => {
                const start = rental.startDate ? new Date(rental.startDate) : null;
                const end = rental.endDate ? new Date(rental.endDate) : null;
                if (!start || !end) return [];
                const dates: Date[] = [];
                const cursor = new Date(start);
                while (cursor <= end) {
                  dates.push(new Date(cursor));
                  cursor.setDate(cursor.getDate() + 1);
                }
                return dates;
              });
            setDisabledDates(bookedDates);
            setHasReturnedRental(
              rentals.some((rental) => {
                if ((rental.status ?? "").toUpperCase() !== "RETURNED") return false;
                const gearItem = (rental as { items?: { gearItem?: { id?: string; _id?: string } }[] }).items?.[0]?.gearItem;
                return gearItem?.id === gearId || gearItem?._id === gearId;
              })
            );
          } catch {
            setDisabledDates([]);
            setHasReturnedRental(false);
          }
        }
      } catch {
        setGear(null);
        setReviews([]);
      }
    };

    void loadGear();
  }, [id, isAuthenticated]);

  const canSubmitReview = Boolean(
    gear?.id &&
      isAuthenticated &&
      !reviews.some(
        (review) =>
          review.gearItemId === gear.id ||
          review.gearItemId === gear._id ||
          review.gearId === gear.id ||
          review.gearId === gear._id
      )
  );

  const nights = useMemo(() => {
    if (!range.from || !range.to) return 0;
    const diff = Math.round((range.to.getTime() - range.from.getTime()) / 86400000) + 1;
    return Math.max(0, diff);
  }, [range.from, range.to]);

  const subtotal = gear ? nights * gear.price * quantity : 0;
  const total = subtotal + SERVICE_FEE;

  const handleQuantityChange = (delta: number) => {
    setQuantity((current) => Math.min(gear?.stock ?? 1, Math.max(1, current + delta)));
  };

  const handleReserve = async () => {
    if (!gear || !range.from || !range.to || !isAuthenticated) {
      setBookingError("Please select a date range and sign in to continue.");
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const rental = await createRental({
        gearItemId: gear.id,
        quantity,
        startDate: format(range.from, "yyyy-MM-dd"),
        endDate: format(range.to, "yyyy-MM-dd"),
      });

      const payment = await createPayment({
        rentalOrderId: rental._id ?? rental.id,
        provider: "STRIPE",
      });

      const redirectUrl = payment.url ?? payment.checkoutUrl ?? payment.paymentUrl ?? payment.redirectUrl ?? payment.sessionUrl;
      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      const nextId = payment._id ?? payment.paymentId ?? rental._id ?? rental.id;
      router.push(`/payment/success?rentalId=${encodeURIComponent(rental._id ?? rental.id ?? "")}&paymentId=${encodeURIComponent(nextId ?? "")}`);
      toast.success("Booking created");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Booking failed";
      setBookingError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!gear?.id || !isAuthenticated || !reviewText.trim()) return;
    try {
      const created = await createReview({ gearItemId: gear.id, rating: reviewRating, comment: reviewText });
      setReviews((prev) => [created, ...prev]);
      setReviewText("");
      setReviewRating(5);
      toast.success("Review posted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not post review");
    }
  };

  if (!gear) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Button asChild variant="outline" className="mb-6 rounded-xl border-border bg-background">
          <Link href="/gear" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </Link>
        </Button>
        <EmptyState title="No data available" description="This gear listing is not available right now." />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-accent">Gear detail</p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{gear.name}</h1>
          {providerName ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
              <Store className="h-4 w-4 text-accent" />
              Provided by <span className="font-medium text-foreground">{providerName}</span>
            </p>
          ) : null}
        </div>
        <Button asChild variant="outline" className="rounded-xl border-border bg-background">
          <Link href="/gear" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to catalog
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section>
          <div className="grid gap-4 md:grid-cols-[1.5fr_0.5fr]">
            <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-accent-soft via-surface-muted to-pine-soft shadow-[0_18px_42px_rgba(26,36,32,0.04)]">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={gear.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl font-display text-ink opacity-60">
                  {gear.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            {gear.images && gear.images.length > 1 ? (
              <div className="grid gap-4">
                {gear.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(image)}
                    aria-label={`View image ${index + 1}`}
                    className={`relative h-24 overflow-hidden rounded-[1.5rem] border transition-all ${
                      activeImage === image
                        ? "border-accent ring-2 ring-accent/30"
                        : "border-border hover:border-accent/40"
                    }`}
                  >
                    <Image src={image} alt={`${gear.name} image ${index + 1}`} fill sizes="160px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
                <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
                <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-[2rem] border border-border bg-surface p-5 shadow-[0_18px_42px_rgba(26,36,32,0.05)]">
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span>{gear.rating}</span>
            <span>({reviews.length} reviews)</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-muted">Price</p>
              <p className="mt-2 font-mono text-3xl font-semibold text-foreground">${gear.price}/day</p>
            </div>
            <span className="rounded-full bg-pine-soft px-2.5 py-1 text-xs font-medium text-pine">
              {gear.available ? "Available" : "Unavailable"}
            </span>
          </div>

          <p className="mt-5 text-base leading-7 text-ink-muted">{gear.description}</p>

          <div className="mt-6 space-y-3 rounded-2xl border border-border bg-surface-muted p-4 text-sm text-ink-muted">
            {gear.brand ? <p>• Brand: {gear.brand}</p> : null}
            <p>• Category: {gear.category}</p>
            <p>• In stock: {gear.stock}</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Dates</label>
              <Calendar
                mode="range"
                selected={range.from && range.to ? { from: range.from, to: range.to } : range.from ? { from: range.from, to: range.from } : undefined}
                onSelect={(value) => setRange({ from: value?.from, to: value?.to })}
                disabled={(date) =>
                  date < startOfToday() ||
                  disabledDates.some((disabledDate) => date.toDateString() === disabledDate.toDateString())
                }
                className="rounded-xl border border-border bg-surface-muted p-3"
              />
              <p className="mt-2 text-sm text-ink-muted">
                {range.from && range.to ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d")}` : "Choose your rental window"}
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Quantity</label>
              <div className="flex w-full max-w-[150px] items-center justify-between rounded-xl border border-border bg-surface-muted px-3 py-2">
                <button type="button" className="text-lg text-ink-muted" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>−</button>
                <span className="font-medium text-foreground">{quantity}</span>
                <button type="button" className="text-lg text-ink-muted" onClick={() => handleQuantityChange(1)} disabled={quantity >= (gear.stock ?? 1)}>+</button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface-muted p-4">
            <div className="flex items-center justify-between text-sm text-ink-muted">
              <span>Subtotal</span>
              <span className="font-mono text-foreground">${subtotal}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-ink-muted">
              <span>Service fee</span>
              <span className="font-mono text-foreground">$12</span>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between text-base font-medium text-foreground">
                <span>Total</span>
                <span className="font-mono">${total}</span>
              </div>
            </div>
          </div>

          {bookingError ? <p className="mt-3 text-sm text-destructive">{bookingError}</p> : null}
          <Button size="lg" className="mt-6 h-12 w-full rounded-xl bg-accent text-white hover:bg-accent/90" onClick={handleReserve} disabled={submitting || !range.from || !range.to || !gear.available}>
            {submitting ? "Renting..." : `Rent now — $${total}`}
          </Button>
          <p className="mt-3 text-center text-sm text-ink-muted">Free pickup and flexible cancellation up to 24 hours before checkout.</p>
        </aside>
      </div>

      <section className="mt-12">
        <Card className="border border-border bg-surface">
          <CardHeader>
            <CardTitle className="font-display text-3xl text-ink">Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {canSubmitReview && hasReturnedRental ? (
              <div className="rounded-2xl border border-border bg-surface-muted p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button key={index} type="button" onClick={() => setReviewRating(index + 1)} className="text-gold">
                      <Star className={`h-5 w-5 ${index < reviewRating ? "fill-gold text-gold" : "text-ink-muted"}`} />
                    </button>
                  ))}
                </div>
                <Input value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="Write a review" />
                <Button onClick={handleReviewSubmit} className="rounded-xl">Post review</Button>
              </div>
            ) : isAuthenticated ? (
              <p className="rounded-2xl border border-border bg-surface-muted px-4 py-3 text-sm text-ink-muted">
                {hasReturnedRental
                  ? "You&apos;ve already reviewed this gear."
                  : "Reviews unlock after your rental for this gear is returned."}
              </p>
            ) : null}
            {reviews.length ? reviews.map((review, index) => (
              <div key={review._id ?? review.id ?? `${review.comment ?? "review"}-${index}`} className="rounded-2xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-foreground">{review.customer?.name ?? review.user?.name ?? "Guest"}</span>
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: review.rating ?? 0 }).map((_, starIndex) => (
                      <Star key={`${review._id ?? review.id ?? review.comment}-${starIndex}`} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{review.comment ?? "No comment provided."}</p>
              </div>
            )) : (
              <EmptyState title="No reviews yet" description="Be the first to leave a review for this gear." />
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}