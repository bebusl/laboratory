/**
 * 스크롤 옵션을 위한 인터페이스
 * 나중에 duration이나 easing 같은 속성이 추가되어도 이 인터페이스만 확장하면 됩니다.
 */
interface ScrollToElementOptions {
  /** 상단 여백 (픽셀 단위, 예: 고정 헤더 높이) */
  offset?: number;
  /** 스크롤 애니메이션 방식 */
  behavior?: ScrollBehavior;
}

/**
 * 특정 ID를 가진 HTML 엘리먼트로 부드럽게 스크롤합니다.
 * * @param id - 이동하고자 하는 엘리먼트의 ID
 * @param options - 스크롤 세부 설정 (offset, behavior 등)
 */
export const scrollToElement = (
  id: string,
  { offset = 0, behavior = 'smooth' }: ScrollToElementOptions = {}
): void => {
  const element = document.getElementById(id);

  if (!element) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[scrollToElement] ID가 "${id}"인 엘리먼트를 찾을 수 없습니다.`);
    }
    return;
  }

  // 엘리먼트의 절대 위치 계산
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
};
