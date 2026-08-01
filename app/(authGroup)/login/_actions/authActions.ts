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

export const loginAction = async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        return {
            success: true,
            statusCode: response.status,
            message: "Login successful",
            data: {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
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