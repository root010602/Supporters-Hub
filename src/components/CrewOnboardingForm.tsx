"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "@/lib/validations/onboarding-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitOnboardingForm } from "@/app/actions/onboarding";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X } from "lucide-react";


export default function CrewOnboardingForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [activeBatch, setActiveBatch] = useState<{ term: number, id: string } | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            tourliveEmail: "",
            contactEmail: "",
            activityType: "",
            nickname: "",
            password: "",
            travelCountry: "",
            travelCity: "",
            hashtag1: "",
            hashtag2: "",
            hashtag3: "",
            bannerImage: undefined,
        },
    });

    const router = useRouter();

    useEffect(() => {
        async function fetchActiveBatch() {
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();
            const { data, error } = await supabase
                .from('batches')
                .select('id, term')
                .eq('is_active', true)
                .single();

            if (data) setActiveBatch(data);
        }
        fetchActiveBatch();
    }, []);

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === "bannerImage" && value instanceof FileList) {
                    formData.append(key, value[0]);
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            const result = await submitOnboardingForm(formData);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("회원가입이 완료되었습니다!");
            router.push(`/dashboard?nickname=${encodeURIComponent(result.nickname || "")}`);
        } catch (error) {
            toast.error("회원가입 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50/50 py-16 px-6 flex items-center justify-center">
            <Card className="w-full max-w-6xl shadow-[0_20px_50px_rgba(255,133,0,0.12)] border-orange-100 rounded-3xl bg-white overflow-hidden">
                <CardHeader className="border-b border-orange-50 bg-white p-10 pb-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-3xl font-extrabold text-primary tracking-tight">투어라이브 크루 회원가입</CardTitle>
                            <CardDescription className="text-orange-900/60 font-semibold mt-3 text-lg">
                                {activeBatch ? `${activeBatch.term}기` : '...'} 활동을 위한 크루 정보를 입력해주세요.
                            </CardDescription>
                        </div>
                        <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                            <span className="text-orange-600 font-bold text-sm">
                                {activeBatch ? `Batch #${activeBatch.term}` : 'Batch Loading...'}
                            </span>
                        </div>
                    </div>
                    {activeBatch && (
                        <div className="mt-6 bg-orange-600/10 border border-orange-600/20 p-4 rounded-xl">
                            <p className="text-orange-700 font-bold text-center">
                                현재 [{activeBatch.term}]기 크루 회원가입이 진행 중입니다.
                            </p>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="p-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                {/* Left Column: 기본 정보 */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">1</div>
                                        <h3 className="text-xl font-bold text-gray-800">기본 정보</h3>
                                    </div>

                                    <div className="space-y-5">
                                        <FormField control={form.control} name="fullName" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-bold">이름</FormLabel>
                                                <FormControl><Input placeholder="홍길동" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500 text-base" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="phone" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-bold">휴대폰 번호</FormLabel>
                                                <FormControl><Input placeholder="010-XXXX-XXXX" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="tourliveEmail" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-bold">투어라이브 계정</FormLabel>
                                                    <FormControl><Input placeholder="tourlive@example.com" type="email" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={form.control} name="contactEmail" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 font-bold">연락용 이메일</FormLabel>
                                                    <FormControl><Input placeholder="personal@example.com" type="email" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>

                                        <FormField control={form.control} name="password" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-bold">비밀번호 (추후 로그인용)</FormLabel>
                                                <FormControl><Input type="password" placeholder="******" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="activityType" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-bold">지원 활동</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500"><SelectValue placeholder="활동 선택" /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="naver_cafe">네이버 '지식여행' 카페 활동</SelectItem>
                                                        <SelectItem value="personal_blog">개인 블로그 활동</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>

                                {/* Right Column: 배너 정보 */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">2</div>
                                        <h3 className="text-xl font-bold text-gray-800">배너 및 활동 정보</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <FormField control={form.control} name="nickname" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700 font-bold">활동 닉네임</FormLabel>
                                                <FormControl><Input placeholder="투어라이브닉" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500 font-bold text-orange-600" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <div>
                                            <p className="text-sm font-bold text-gray-700 mb-2">여행 국가 및 도시</p>
                                            <div className="flex gap-4">
                                                <FormField control={form.control} name="travelCountry" render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl><Input placeholder="프랑스" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={form.control} name="travelCity" render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl><Input placeholder="파리" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-gray-700 mb-2">본인 관련 해시태그 3가지</p>
                                            <div className="flex gap-3">
                                                <FormField control={form.control} name="hashtag1" render={({ field }) => (
                                                    <FormItem className="flex-1"><FormControl><Input placeholder="#교환학생" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="hashtag2" render={({ field }) => (
                                                    <FormItem className="flex-1"><FormControl><Input placeholder="#유빙" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={form.control} name="hashtag3" render={({ field }) => (
                                                    <FormItem className="flex-1"><FormControl><Input placeholder="#유럽" className="h-12 rounded-xl border-gray-200 focus:ring-orange-500 focus:border-orange-500" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>
                                        </div>

                                        <FormItem>
                                            <FormLabel className="text-gray-700 font-bold">배너 이미지 업로드</FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id="banner-upload"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setSelectedFile(file);
                                                                setPreviewUrl(URL.createObjectURL(file));
                                                                form.setValue("bannerImage", e.target.files);
                                                            }
                                                        }}
                                                    />
                                                    <Label
                                                        htmlFor="banner-upload"
                                                        className={`
                                                            border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer 
                                                            hover:bg-orange-50/50 transition-all flex flex-col items-center justify-center min-h-[200px]
                                                            ${previewUrl ? 'border-transparent p-0 shadow-lg' : 'border-orange-200 bg-orange-50/20'}
                                                        `}
                                                    >
                                                        {previewUrl ? (
                                                            <div className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-inner bg-gray-100">
                                                                <img
                                                                    src={previewUrl}
                                                                    alt="Banner preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white font-bold">
                                                                        이미지 변경하기
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm border border-orange-100 group-hover:scale-110 transition-transform">
                                                                    <Upload className="w-7 h-7 text-orange-500" />
                                                                </div>
                                                                <span className="text-gray-700 text-base font-bold">
                                                                    사진을 업로드하세요
                                                                </span>
                                                                <p className="text-sm text-gray-500 px-4">본인의 여행 감성이 잘 드러나는 사진일수록 좋습니다.</p>
                                                            </div>
                                                        )}
                                                    </Label>
                                                    {previewUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setPreviewUrl(null);
                                                                setSelectedFile(null);
                                                                form.setValue("bannerImage", undefined);
                                                            }}
                                                            className="absolute -top-3 -right-3 p-2 bg-white shadow-lg border border-orange-100 rounded-full text-orange-500 hover:text-orange-600 transition-colors"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-orange-50 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto md:min-w-[240px] h-14 text-white text-xl font-bold rounded-2xl shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-to-r from-orange-500 to-orange-600"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                            데이터 저장 중...
                                        </>
                                    ) : (
                                        "가입 완료"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
