"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
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
import { format } from "date-fns";
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
  } | null>(null);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const id = params?.id;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadGear = async () => {
      setLoading(true);
      try {
        const item = await getGearById(id);

        if (!item) {
          setGear(null);
          setReviews([]);
          return;
        }

        const gearId = item.id ?? item._id ?? id;
        const stockValue = Number(item.stockQuantity ?? item.stock ?? 0);
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
        });

        try {
          const nextReviews = await getGearReviews(gearId);
          setReviews(Array.isArray(nextReviews) ? nextReviews : []);
        } catch {
          setReviews([]);
        }

        if (isAuthenticated) {
          try {
            const nextRentals = await getMyRentals();
            const bookedDates = (Array.isArray(nextRentals) ? nextRentals : [])
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
          } catch {
            setDisabledDates([]);
          }
        }
      } catch {
        setGear(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    void loadGear();
  }, [id, isAuthenticated]);

  const canSubmitReview = useMemo(() => {
    if (!gear?.id || !isAuthenticated) return false;
    return !reviews.some((review) => review.gearId === gear.id || review.gearId === gear._id);
  }, [gear?._id, gear?.id, isAuthenticated, reviews]);

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
      const created = await createReview({ gearId: gear.id, rating: reviewRating, comment: reviewText });
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
            <div className="h-[420px] rounded-[2rem] border border-border bg-gradient-to-br from-accent-soft via-surface-muted to-pine-soft shadow-[0_18px_42px_rgba(26,36,32,0.04)]" />
            <div className="grid gap-4">
              <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
              <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
              <div className="h-24 rounded-[1.5rem] border border-border bg-surface-muted" />
            </div>
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
            <p>• Capacity: 4 people</p>
            <p>• Condition: Like new</p>
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
                disabled={(date) => disabledDates.some((disabledDate) => date.toDateString() === disabledDate.toDateString())}
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
            {submitting ? "Reserving..." : `Reserve — $${total}`}
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
            {canSubmitReview ? (
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
            ) : null}
            {reviews.length ? reviews.map((review, index) => (
              <div key={review._id ?? review.id ?? `${review.comment ?? "review"}-${index}`} className="rounded-2xl border border-border bg-surface-muted p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-foreground">{review.user?.name ?? "Guest"}</span>
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