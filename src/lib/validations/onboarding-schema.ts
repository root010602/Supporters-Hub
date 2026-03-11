import { z } from "zod";

export const stepOneSchema = z.object({
    fullName: z.string().min(2, { message: "이름은 2자 이상이어야 합니다." }),
    phone: z.string().min(10, { message: "올바른 휴대폰 번호를 입력해주세요." }),
    tourliveEmail: z.string().email({ message: "올바른 이메일 주소를 입력해주세요." }),
    contactEmail: z.string().email({ message: "올바른 이메일 주소를 입력해주세요." }),
    activityType: z.string().min(1, { message: "활동 유형을 선택해주세요." }),
    nickname: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
    password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
});

export const stepTwoSchema = z.object({
    travelCountry: z.string().min(2, { message: "국가를 입력해주세요." }),
    travelCity: z.string().min(2, { message: "도시를 입력해주세요." }),
    hashtag1: z.string().min(2, { message: "필수 입력 항목입니다." }),
    hashtag2: z.string().min(2, { message: "필수 입력 항목입니다." }),
    hashtag3: z.string().min(2, { message: "필수 입력 항목입니다." }),
    bannerImage: z.any()
        .refine((files) => files?.length == 1, "이미지가 필요합니다.")
});

export const formSchema = stepOneSchema.merge(stepTwoSchema);

export type FormValues = z.infer<typeof formSchema>;
