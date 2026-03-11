# Dashboard Module Rules

## Overview
- **Path**: `/dashboard`
- **Aesthetic**: Sleek & Pastel theme. White background (`#F8F9FA`), cards with subtle shadows, and pastel accents.

## Mission Tracker ("필수 활동 3가지")
- **Layout**: Visual stepper at the top of the page.
- **Status Logic**:
    - **'완료' (Completed)**: Mission submitted and verified.
    - **'진행 중' (Ongoing)**: Mission scheduled for the current month.
    - **'대기' (Pending)**: Mission scheduled for a future date.
- **Titles**: Use "필수 활동 3가지" instead of English terminology.

## Interactive Calendar
- **Implementation**: Custom grid or library rendering a monthly view.
- **Markers**:
    - **Essential Missions**: Orange markers/highlights (`#FFD6E0` background).
    - **Events/Surveys**: Blue markers/highlights (`#D6E4FF` background).
- **Interaction**: Clicking a date shows a popup with activity details.

## Team-Specific Activities
- **Dynamic Content**:
    - **Naver Cafe Team**: Show "5 Travel Info posts", "30 comments", and "1 Review mission".
    - **Blog Team**: Show "2 Review missions".
- **Update Frequency**: Status defaults to daily updates (mock message suggested).

## Submission Checklist (Reviews)
For missions involving "사용후기글" (Review posts), a mandatory 5-point self-checklist must be completed before the "최종 미션 제출하기" button is enabled:
1. [ ] 투어라이브 어플 캡처 사진 5장 이상 포함
2. [ ] 직접 찍은 사진 5장 이상 포함
3. [ ] 투어/가이드북 UTM 링크 첨부 (Validate `utm_campaign` includes user ID)
4. [ ] 크루 배너 이미지 삽입
5. [ ] 하단 필수 멘트 포함 ("이 글은 투어라이브 크루 활동의 일환으로...")

## Text Validation
- **Requirement**: Users must paste their post content into a textarea for validation.
- **Logic**: Automatically detect if the mandatory closing statement exists in the pasted text.
- **Indicator**: Show real-time feedback (e.g., "필수 하단 멘트 확인됨" or "하단 멘트가 보이지 않습니다").
