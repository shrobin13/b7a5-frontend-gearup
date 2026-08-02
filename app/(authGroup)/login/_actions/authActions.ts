"use server"

type LoginState = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: {
        accessToken?: string;
        refreshToken?: string;
    }
}

function getAppBaseUrl() {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    return "http://localhost:3000";
}

export const loginAction = async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const response = await fetch(`${getAppBaseUrl()}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            cache: "no-store",
        });

        const data = await response.json().catch(() => null);
        console.log(data, 'data');

        if (!response.ok) {
            throw new Error(data?.message || "Login failed");
        }

        return {
            success: true,
            statusCode: response.status,
            message: data?.message || "Login successful",
            data: {
                accessToken: data?.data?.accessToken ?? data?.accessToken,
                refreshToken: data?.data?.refreshToken ?? data?.refreshToken,
            },
        };
    } catch (error) {
        return {
            success: false,
            statusCode: 500,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }   
}
