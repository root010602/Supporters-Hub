"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
    CheckCircle2,
    Calendar as CalendarIcon,
    FileText,
    Bell,
    Users,
    ExternalLink,
    Clock,
    User,
    ArrowRight,
    Trophy,
    Target,
    AlertCircle,
    Check,
    Coffee,
    BookOpen,
    Quote
} from "lucide-react";
import { Suspense } from "react";
import { getDashboardData } from "@/app/actions/dashboard";
import { submitMission } from "@/app/actions/mission";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MonthlyMissionCard({ currentMission }: { currentMission: any }) {
    const [link, setLink] = useState(currentMission?.post_url || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const isSubmitted = currentMission?.status && currentMission.status !== 'none';
    const statusText = currentMission?.status === 'checking' ? 'AI 검토 중' : 
                      currentMission?.status === 'completed' ? '검토 완료' : 
                      currentMission?.status === 'rejected' ? '반려됨' : '미제출';

    const handleLinkSubmit = async () => {
        if (!link) return;
        setIsSubmitting(true);
        const res = await submitMission(link);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("미션이 제출되었습니다! AI 검토가 시작됩니다.");
            router.refresh();
        }
        setIsSubmitting(false);
    };

    return (
        <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-none rounded-[32px] overflow-hidden bg-white p-2">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center tracking-tight">
                        <Trophy className="w-6 h-6 mr-3 text-[#FF5C00]" />
                        미션 제출 데스크
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium mt-1">
                        이달의 미션 활동 링크를 제출해 주세요.
                    </CardDescription>
                </div>
                {isSubmitted && (
                    <Badge className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        currentMission.status === 'checking' ? "bg-orange-50 text-orange-600 border border-orange-100" :
                        currentMission.status === 'completed' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                        "bg-red-50 text-red-600 border border-red-100"
                    )}>
                        {statusText}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="px-8 pb-8">
                {isSubmitted ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                <ExternalLink className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">제출된 링크</span>
                                <span className="text-sm font-bold text-slate-700 truncate block">{currentMission.post_url}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-slate-800">
                             <a href={currentMission.post_url} target="_blank" rel="noopener noreferrer">
                                <ArrowRight className="w-4 h-4" />
                             </a>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <Input
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="활동 링크를 입력하세요 (블로그/카페)"
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white text-sm shadow-none transition-all pr-10"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                                <span title="필수 준수 사항: 앱 캡처 5장 이상, 직접 찍은 사진 5장 이상, UTM 링크 포함, 크루 배너 삽입, 하단 필수 멘트 포함">
                                    <AlertCircle className="w-4 h-4 cursor-help" />
                                </span>
                            </div>
                        </div>
                        <Button 
                            onClick={handleLinkSubmit}
                            disabled={!link || isSubmitting}
                            className="h-12 w-full rounded-2xl bg-[#FF5C00] hover:bg-[#E63900] text-white font-black shadow-lg shadow-orange-100/50"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            ) : "Submit for AI Review"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


function DashboardHeader({ nickname, term, dDay }: { nickname: string, term: number, dDay: number }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight whitespace-nowrap">
                        반갑습니다, <span className="text-[#FF5C00]">{nickname}</span>님!
                    </h1>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="px-3 py-1 rounded-full bg-[#FF5C00]/10 text-[#FF5C00] text-xs font-bold border border-[#FF5C00]/20 whitespace-nowrap">
                            {term}기 투어라이브 크루
                        </span>
                        <p className="text-slate-500 text-sm font-medium whitespace-nowrap">
                            활동 <span className="text-slate-800 font-bold">{dDay}</span>일차입니다
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" className="h-12 rounded-2xl border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all whitespace-nowrap">
                    <Bell className="w-4 h-4 mr-2" />
                    공지사항
                </Button>
            </div>
        </div>
    );
}

function TeamMissionList({ team }: { team: string }) {
    const isCafe = team === 'Naver Cafe';
    const currentMonth = new Date().getMonth() + 1;
    const teamName = isCafe ? "네이버 지식카페 활동" : "네이버 블로그 활동";
    const [showGuidelines, setShowGuidelines] = useState(false);

    return (
        <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-none rounded-[32px] overflow-hidden bg-white p-2">
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center tracking-tight whitespace-nowrap">
                        {isCafe ? <Coffee className="w-6 h-6 mr-3 text-[#FF5C00]" /> : <BookOpen className="w-6 h-6 mr-3 text-[#0052CC]" />}
                        {currentMonth}월 미션 현황
                    </CardTitle>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 whitespace-nowrap">
                        {teamName}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <CardDescription className="text-slate-500 font-medium truncate">
                        기한 내에 지정된 미션을 완료해 주세요.
                    </CardDescription>
                    <button
                        onClick={() => setShowGuidelines(!showGuidelines)}
                        className="text-[10px] font-black text-[#FF5C00] hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                        <AlertCircle className="w-3 h-3" />
                        {showGuidelines ? "가이드 접기" : "가이드라인 보기"}
                    </button>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
                {showGuidelines && (
                    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h4 className="text-xs font-black text-orange-800 mb-2 flex items-center gap-2 uppercase tracking-widest">
                            <Target className="w-3 h-3 text-orange-500" />
                            Activity Guidelines
                        </h4>
                        <ul className="space-y-1.5">
                            {isCafe ? (
                                <>
                                    <li className="text-[11px] text-orange-700 font-bold flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                        정보글 5건 및 댓글 30건 필수 참여
                                    </li>
                                    <li className="text-[11px] text-orange-700 font-bold flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                        가이드북 후기 작성 시 이미지 5장 이상
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="text-[11px] text-orange-700 font-bold flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                        월 2건 오디오가이드/가이드북 후기 작성
                                    </li>
                                    <li className="text-[11px] text-orange-700 font-bold flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                        필수 멘트 및 UTM 소스 링크 삽입 필수
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
                {isCafe ? (
                    <>
                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-sm transition-all duration-300">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm text-xs font-black shrink-0">01</span>
                                <span className="text-sm font-bold text-slate-700 truncate whitespace-nowrap">여행 정보 게시글 등록</span>
                            </div>
                            <span className="font-black text-slate-800 ml-4 shrink-0 whitespace-nowrap">0 / 5개</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-sm transition-all duration-300">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm text-xs font-black shrink-0">02</span>
                                <span className="text-sm font-bold text-slate-700 truncate whitespace-nowrap">커뮤니티 댓글 활동</span>
                            </div>
                            <span className="font-black text-slate-800 ml-4 shrink-0 whitespace-nowrap">0 / 30개</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#FFF5F1] border border-[#FFD9C6] flex items-center justify-between text-[#FF5C00] group hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="w-8 h-8 rounded-xl bg-[#FF5C00] flex items-center justify-center text-white shadow-sm text-xs font-black shrink-0">03</span>
                                <span className="text-sm font-black truncate whitespace-nowrap">가이드북 사용후기글</span>
                            </div>
                            <span className="font-black ml-4 shrink-0 whitespace-nowrap">0 / 1개</span>
                        </div>
                    </>
                ) : (
                    <div className="p-6 rounded-3xl bg-[#F0F5FF]/30 border border-[#D6E4FF] flex items-center justify-between text-[#0052CC] group hover:bg-white hover:shadow-lg transition-all duration-500">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#0052CC] shadow-sm shrink-0">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="overflow-hidden">
                                <span className="text-sm font-black block truncate whitespace-nowrap">가이드북 사용후기글</span>
                                <span className="text-[10px] font-bold opacity-60 truncate whitespace-nowrap tracking-tight">총 2건의 후기 작성이 필요합니다</span>
                            </div>
                        </div>
                        <span className="font-black text-xl ml-4 shrink-0 whitespace-nowrap">0 / 2개</span>
                    </div>
                )}
                <p className="text-[10px] text-slate-400 font-medium text-center pt-2 tracking-tight whitespace-nowrap">
                    * 활동 현황은 매일 오전 6시에 최종 업데이트됩니다.
                </p>
            </CardContent>
        </Card>
    );
}

// Unused components (ActivityStepper, SubmissionDialog) have been removed for a cleaner dashboard layout.

function EventCalendar({ schedules }: { schedules: any[] }) {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const getEventsForDay = (day: number) => {
        return schedules.filter(s => {
            const date = new Date(s.scheduled_at);
            return date.getDate() === day &&
                date.getMonth() === viewDate.getMonth() &&
                date.getFullYear() === viewDate.getFullYear();
        });
    };

    return (
        <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-none rounded-[32px] overflow-hidden bg-white p-2">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center tracking-tight">
                    <CalendarIcon className="w-6 h-6 mr-3 text-[#FF5C00]" />
                    활동 캘린더
                </CardTitle>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFD6E0]" />
                        <span className="text-xs text-slate-400 font-bold">필수</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D6E4FF]" />
                        <span className="text-xs text-slate-400 font-bold">이벤트</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-2xl font-black text-slate-800 tracking-tighter">
                        {viewDate.getFullYear()}. {String(viewDate.getMonth() + 1).padStart(2, '0')}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0 rounded-xl border-slate-100 text-slate-400 hover:text-slate-800 transition-all font-bold"
                            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                        >
                            &lt;
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-10 h-10 p-0 rounded-xl border-slate-100 text-slate-400 hover:text-slate-800 transition-all font-bold"
                            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                        >
                            &gt;
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px mb-4 border-b border-slate-50 pb-2">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day} className="text-center text-[10px] font-black text-slate-300 py-2 tracking-widest">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-3">
                    {blanks.map(i => <div key={`blank-${i}`} className="h-20" />)}
                    {days.map(day => {
                        const dayEvents = getEventsForDay(day);
                        const isToday = today.getDate() === day &&
                            today.getMonth() === viewDate.getMonth() &&
                            today.getFullYear() === viewDate.getFullYear();

                        return (
                            <div
                                key={day}
                                className={cn(
                                    "h-20 border border-slate-50 rounded-2xl p-2 transition-all cursor-pointer group hover:bg-slate-50 hover:shadow-inner",
                                    isToday && "bg-[#F0F5FF]/50 border-[#D6E4FF]"
                                )}
                                onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                            >
                                <span className={cn(
                                    "text-sm font-bold block mb-1",
                                    isToday ? "text-[#0052CC]" : "text-slate-400 group-hover:text-slate-600"
                                )}>{day}</span>
                                <div className="space-y-1">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                "h-1.5 rounded-full w-full",
                                                event.is_essential ? "bg-[#FFD6E0]" : "bg-[#D6E4FF]"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedEvent && (
                    <div className="mt-8 p-6 bg-slate-50 rounded-[28px] border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden group">
                        <div className={cn(
                            "absolute top-0 left-0 w-2 h-full",
                            selectedEvent.is_essential ? "bg-[#FFD6E0]" : "bg-[#D6E4FF]"
                        )} />
                        <div className="flex items-center justify-between mb-4">
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                selectedEvent.is_essential
                                    ? "bg-[#FFF0F3] border-[#FFD6E0] text-[#E63946]"
                                    : "bg-[#F0F5FF] border-[#D6E4FF] text-[#0052CC]"
                            )}>
                                {selectedEvent.type === 'mission' ? 'Essential Mission' : 'General Event'}
                            </span>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                            >
                                <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 leading-tight">{selectedEvent.title}</h4>
                        <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed">{selectedEvent.description}</p>
                        <div className="mt-6 flex items-center text-xs text-slate-400 font-bold bg-white/50 w-fit px-4 py-2 rounded-xl backdrop-blur-sm">
                            <Clock className="w-4 h-4 mr-2 text-slate-300" />
                            Deadline: <span className="text-slate-600 ml-1">{new Date(selectedEvent.scheduled_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function QuickLinks() {
    const links = [
        { title: "활동 가이드", desc: "미션 가이드라인", icon: FileText, href: "/dashboard/guide" },
        { title: "공식 커뮤니티", desc: "지식카페 바로가기", icon: Users, href: "https://cafe.naver.com/jisiktravel", external: true },
        { title: "관리자 문의", desc: "이메일 문의하기", icon: ExternalLink, href: "mailto:root@tourlive.co.kr" }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {links.map(link => (
                <Link
                    href={link.href}
                    key={link.title}
                    className="group"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                >
                    <Card className="hover:shadow-md transition-all duration-300 border border-slate-100 rounded-2xl bg-white p-1 h-full overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                                <link.icon className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-extrabold text-slate-800 text-sm whitespace-nowrap truncate tracking-tight">
                                    {link.title}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap truncate tracking-tight">
                                    {link.desc}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

function DashboardContent() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getDashboardData();
            if ('error' in res) {
                console.error(res.error);
            } else {
                setData(res);
            }
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-[#F8F9FA] rounded-[40px] border border-slate-100 shadow-inner">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-[#FFD6E0] animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-4 border-white border-t-transparent animate-spin" />
                    </div>
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Initializing Dashboard</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-24 bg-white rounded-[40px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col items-center">
                <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center mb-6">
                    <Trophy className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800">접근할 수 없습니다</h3>
                <p className="text-slate-400 font-medium mt-2 max-w-sm">로그인 세션이 만료되었거나<br />등록된 프로필 정보를 찾을 수 없습니다.</p>
                <Button asChild className="mt-10 h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold transition-all hover:scale-105">
                    <Link href="/login">다시 로그인하기</Link>
                </Button>
            </div>
        );
    }

    const teamName = data.team === 'Naver Cafe' ? "네이버 지식카페 활동" : "네이버 블로그 활동";

    return (
        <div className="max-w-[1400px] mx-auto px-10 py-16">
            <DashboardHeader
                nickname={data.nickname}
                term={data.term}
                dDay={data.dDay}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4 space-y-12">
                    <MonthlyMissionCard currentMission={data.currentMission} />
                    <TeamMissionList team={data.team} />
                </div>
                <div className="lg:col-span-8 space-y-8">
                    <QuickLinks />
                    <EventCalendar schedules={data.schedules} />
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] selection:bg-[#FF5C00] selection:text-white">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 rounded-[32px] bg-white shadow-xl animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full border-4 border-[#FF5C00] border-t-transparent animate-spin" />
                        </div>
                    </div>
                </div>
            }>
                <DashboardContent />
            </Suspense>
        </div>
    );
}
