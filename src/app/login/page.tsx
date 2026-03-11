"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/app/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const result = await signIn(formData);

        if (result?.error) {
            toast.error(result.error);
            setIsPending(false);
        }
    }

    return (
        <div className="min-h-screen bg-orange-50/50 flex items-center justify-center p-6">
            <Card className="w-full max-w-md shadow-2xl border-orange-100 rounded-3xl overflow-hidden bg-white">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
                <CardHeader className="pt-10 pb-6 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                        투어라이브 크루 로그인
                    </CardTitle>
                    <CardDescription className="text-orange-900/60 mt-2">
                        활동 대시보드 접근을 위해 로그인해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-bold">투어라이브 계정 (이메일)</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tourlive@example.com"
                                required
                                className="h-12 rounded-xl border-gray-200 focus:ring-orange-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-bold">비밀번호</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="******"
                                required
                                className="h-12 rounded-xl border-gray-200 focus:ring-orange-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-100 transition-all hover:scale-[1.02]"
                        >
                            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "로그인"}
                        </Button>
                    </form>
                    <div className="mt-8 text-center border-t border-orange-50 pt-6">
                        <p className="text-sm text-gray-500">
                            계정이 없으신가요?{" "}
                            <Link href="/signup" className="text-orange-600 font-bold hover:underline">
                                회원가입하기
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
