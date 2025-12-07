import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { recipients, subject, htmlContent } = body;

        if (!recipients || recipients.length === 0) {
            return NextResponse.json({ error: "Recipients array is required" }, { status: 400 });
        }

        if (!process.env.RESEND_API_KEY || !process.env.NEXT_PUBLIC_SENDER_EMAIL) {
            console.warn("RESEND_API_KEY or NEXT_PUBLIC_SENDER_EMAIL is missing. Mocking success for dev.");
            return NextResponse.json({ success: true, mocked: true });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // Map recipients to the format Resend expects (single string or array of strings)
        // Assuming recipients is an array of objects { email: string, name?: string } from previous code structure
        // But Resend `to` field takes string or array of strings.
        const toList = recipients.map((r: any) => r.email);

        const { data, error } = await resend.emails.send({
            from: `Team Intellect Protocol <${process.env.NEXT_PUBLIC_SENDER_EMAIL}>`,
            to: toList,
            subject: subject || "Confirmation Email",
            html: htmlContent || "<p>Its supporter from Intellect Protocol!</p>",
        });

        if (error) {
            console.error("Resend Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error("Send Email Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
