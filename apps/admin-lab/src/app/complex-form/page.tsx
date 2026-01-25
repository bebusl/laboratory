'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import BasicInfoSection from './components/BasicInfoSection';
import PricePolicySection from './components/PricePolicySection';
import StockSection from './components/StockSection';
import DisplaySettingSection from './components/DisplaySettingSection';
import DeliverySection from './components/DeliverySection';

type ProductType = '단일' | '옵션형' | '구독형';
type StockType = '자동' | '수동';
type DeliveryType = '무료' | '유료' | '조건부';
type CycleType = '주' | '월' | '년';

interface OptionGroup {
  id: string;
  name: string;
  selectionType: '단일' | '다중';
  options: OptionItem[];
}

interface OptionItem {
  id: string;
  name: string;
  additionalPrice: number;
  stock: number;
}

// 폼 전체 상태를 위한 거대한 인터페이스
interface FormState {
  // 기본 정보
  productName: string;
  productCode: string;
  productDescription: string;
  productType: ProductType;

  // 가격 - 단일
  salePrice: number;
  discountRate: number;
  finalPrice: number;

  // 가격 - 옵션형
  optionGroups: OptionGroup[];
  minPrice: number;
  maxPrice: number;

  // 가격 - 구독형
  paymentCycle: CycleType;
  minSubscriptionPeriod: number;
  hasCancellationFee: boolean;
  cancellationFee: number;

  // 재고
  useStockManagement: boolean;
  stockQuantity: number;
  stockType: StockType;

  // 노출 설정
  startDate: string;
  endDate: string;
  showWeb: boolean;
  showMobile: boolean;
  showExternalMarket: boolean;
  externalMarketId: string;

  // 배송
  deliveryType: DeliveryType;
  deliveryFee: number;
  remoteAreaFee: number;
  conditionalAmount: number;

  // 메타 상태
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDraft: boolean;
  isSubmitting: boolean;
}

const ComplexFormPage = () => {
  // ========================================
  // 기본 정보 상태 (useState 남발의 시작)
  // ========================================
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productType, setProductType] = useState<ProductType>('단일');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState('');

  // ========================================
  // 가격 정책 - 단일 상품
  // ========================================
  const [salePrice, setSalePrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  // ========================================
  // 가격 정책 - 옵션형
  // ========================================
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  // ========================================
  // 가격 정책 - 구독형
  // ========================================
  const [paymentCycle, setPaymentCycle] = useState<CycleType>('월');
  const [minSubscriptionPeriod, setMinSubscriptionPeriod] = useState(1);
  const [hasCancellationFee, setHasCancellationFee] = useState(false);
  const [cancellationFee, setCancellationFee] = useState(0);

  // ========================================
  // 재고 / 판매 조건
  // ========================================
  const [useStockManagement, setUseStockManagement] = useState(false);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockType, setStockType] = useState<StockType>('자동');

  // ========================================
  // 노출 설정
  // ========================================
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showWeb, setShowWeb] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showExternalMarket, setShowExternalMarket] = useState(false);
  const [externalMarketId, setExternalMarketId] = useState('');
  const [isMarketConnecting, setIsMarketConnecting] = useState(false);

  // ========================================
  // 배송 정보
  // ========================================
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('무료');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [remoteAreaFee, setRemoteAreaFee] = useState(0);
  const [conditionalAmount, setConditionalAmount] = useState(0);

  // ========================================
  // 폼 메타 상태
  // ========================================
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========================================
  // 추가 상태들 (더더욱 복잡하게 만들기 위해)
  // ========================================
  const [formMode] = useState<'create' | 'edit'>('create');
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<FormState | null>(null);

  // 폼 로딩 상태
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ========================================
  // useEffect 지옥 시작
  // ========================================

  // 폼 초기 로딩
  useEffect(() => {
    const loadForm = async () => {
      setIsFormLoading(true);

      // 가짜 로딩 시뮬레이션
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setLoadingProgress(i);
      }

      setIsFormLoading(false);
    };

    loadForm();
  }, []);

  // ========================================
  // Validation 함수들
  // ========================================

  const validateAll = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // 기본 정보 검증
    if (!productName || productName.length < 2 || productName.length > 40) {
      newErrors.productName = '상품명은 2~40자여야 합니다.';
    }

    if (!productCode) {
      newErrors.productCode = '상품 코드는 필수입니다.';
    }

    if (codeError) {
      newErrors.productCode = codeError;
    }

    if (productDescription && productDescription.length > 500) {
      newErrors.productDescription = '상품 설명은 500자 이하여야 합니다.';
    }

    // 가격 검증
    if (productType === '단일') {
      if (salePrice <= 0) {
        newErrors.salePrice = '판매가는 0보다 커야 합니다.';
      }
    }

    // 재고 검증
    if (productType === '단일' && useStockManagement && stockQuantity < 0) {
      newErrors.stockQuantity = '재고 수량은 음수일 수 없습니다.';
    }

    // 옵션 검증
    if (productType === '옵션형' && optionGroups.length === 0) {
      newErrors.options = '옵션형 상품은 최소 1개의 옵션이 필요합니다.';
    }

    // 날짜 검증
    if (startDate && new Date(startDate) < new Date()) {
      newErrors.startDate = '시작일은 현재 시각 이후여야 합니다.';
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다.';
    }

    // 배송비 검증
    if (productType !== '구독형' && deliveryType === '조건부' && !conditionalAmount) {
      newErrors.conditionalAmount = '조건부 배송비는 금액 조건이 필수입니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    productName,
    productCode,
    productDescription,
    productType,
    codeError,
    salePrice,
    useStockManagement,
    stockQuantity,
    optionGroups,
    startDate,
    endDate,
    deliveryType,
    conditionalAmount,
  ]);


  // ========================================
  // 폼 제출 핸들러들
  // ========================================

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isMarketConnecting) {
        alert('마켓 연동 중에는 제출할 수 없습니다.');
        return;
      }

      const isValid = validateAll();

      if (!isValid) {
        alert('입력 오류가 있습니다.');
        setShowValidationSummary(true);
        return;
      }

      setIsSubmitting(true);

      // 가짜 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));

      const formData = {
        productName,
        productCode,
        productDescription,
        productType,
        salePrice,
        discountRate,
        finalPrice,
        optionGroups,
        minPrice,
        maxPrice,
        paymentCycle,
        minSubscriptionPeriod,
        hasCancellationFee,
        cancellationFee,
        useStockManagement,
        stockQuantity,
        stockType,
        startDate,
        endDate,
        showWeb,
        showMobile,
        showExternalMarket,
        externalMarketId,
        deliveryType,
        deliveryFee,
        remoteAreaFee,
        conditionalAmount,
      };

      console.log('Form submitted:', formData);

      alert('상품이 등록되었습니다!');
      setIsSubmitting(false);
    },
    [
      isMarketConnecting,
      validateAll,
      errors,
      productName,
      productCode,
      productDescription,
      productType,
      salePrice,
      discountRate,
      finalPrice,
      optionGroups,
      minPrice,
      maxPrice,
      paymentCycle,
      minSubscriptionPeriod,
      hasCancellationFee,
      cancellationFee,
      useStockManagement,
      stockQuantity,
      stockType,
      startDate,
      endDate,
      showWeb,
      showMobile,
      showExternalMarket,
      externalMarketId,
      deliveryType,
      deliveryFee,
      remoteAreaFee,
      conditionalAmount,
    ]
  );

  // ========================================
  // 미리보기 핸들러
  // ========================================
  const handlePreview = useCallback(() => {
    const data: FormState = {
      productName,
      productCode,
      productDescription,
      productType,
      salePrice,
      discountRate,
      finalPrice,
      optionGroups,
      minPrice,
      maxPrice,
      paymentCycle,
      minSubscriptionPeriod,
      hasCancellationFee,
      cancellationFee,
      useStockManagement,
      stockQuantity,
      stockType,
      startDate,
      endDate,
      showWeb,
      showMobile,
      showExternalMarket,
      externalMarketId,
      deliveryType,
      deliveryFee,
      remoteAreaFee,
      conditionalAmount,
      errors,
      touched,
      isDraft: false,
      isSubmitting,
    };

    setPreviewData(data);
    setShowPreview(true);
  }, [
    productName,
    productCode,
    productDescription,
    productType,
    salePrice,
    discountRate,
    finalPrice,
    optionGroups,
    minPrice,
    maxPrice,
    paymentCycle,
    minSubscriptionPeriod,
    hasCancellationFee,
    cancellationFee,
    useStockManagement,
    stockQuantity,
    stockType,
    startDate,
    endDate,
    showWeb,
    showMobile,
    showExternalMarket,
    externalMarketId,
    deliveryType,
    deliveryFee,
    remoteAreaFee,
    conditionalAmount,
    errors,
    touched,
    isSubmitting,
  ]);

  // ========================================
  // 폼 리셋
  // ========================================
  const handleReset = useCallback(() => {
    if (!confirm('모든 입력 내용을 초기화하시겠습니까?')) return;

    setProductName('');
    setProductCode('');
    setProductDescription('');
    setProductType('단일');
    setSalePrice(0);
    setDiscountRate(0);
    setFinalPrice(0);
    setOptionGroups([]);
    setMinPrice(0);
    setMaxPrice(0);
    setPaymentCycle('월');
    setMinSubscriptionPeriod(1);
    setHasCancellationFee(false);
    setCancellationFee(0);
    setUseStockManagement(false);
    setStockQuantity(0);
    setStockType('자동');
    setStartDate('');
    setEndDate('');
    setShowWeb(false);
    setShowMobile(false);
    setShowExternalMarket(false);
    setExternalMarketId('');
    setDeliveryType('무료');
    setDeliveryFee(0);
    setRemoteAreaFee(0);
    setConditionalAmount(0);
    setErrors({});
    setTouched({});
  }, []);

  // ========================================
  // 로딩 화면
  // ========================================
  if (isFormLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-600">폼을 불러오는 중... {loadingProgress}%</p>
        </div>
      </div>
    );
  }

  // ========================================
  // 메인 렌더링
  // ========================================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {formMode === 'create' ? '상품 등록' : '상품 수정'}
                <span className="text-sm font-normal text-gray-500 ml-3">
                  (리팩토링 과제용 안티패턴 - Props Drilling 지옥)
                </span>
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                모든 상태가 props로 전달되는 극악의 구조를 경험해보세요
              </p>
            </div>

          </div>

          {/* 에러 요약 */}
          {showValidationSummary && Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-red-800 mb-2">
                    입력 오류 {Object.keys(errors).length}개
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-red-700">
                    {Object.values(errors)
                      .slice(0, 5)
                      .map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    {Object.keys(errors).length > 5 && (
                      <li className="text-red-600">... 외 {Object.keys(errors).length - 5}개</li>
                    )}
                  </ul>
                </div>
                <button
                  onClick={() => setShowValidationSummary(false)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 폼 시작 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <BasicInfoSection
            productName={productName}
            setProductName={setProductName}
            productCode={productCode}
            setProductCode={setProductCode}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            productType={productType}
            setProductType={setProductType}
            errors={errors}
            setErrors={setErrors}
            touched={touched}
            setTouched={setTouched}
            isCheckingCode={isCheckingCode}
            setIsCheckingCode={setIsCheckingCode}
            codeError={codeError}
            setCodeError={setCodeError}
          />

          {/* 가격 정책 섹션 */}
          <PricePolicySection
            productType={productType}
            salePrice={salePrice}
            setSalePrice={setSalePrice}
            discountRate={discountRate}
            setDiscountRate={setDiscountRate}
            finalPrice={finalPrice}
            setFinalPrice={setFinalPrice}
            optionGroups={optionGroups}
            setOptionGroups={setOptionGroups}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            paymentCycle={paymentCycle}
            setPaymentCycle={setPaymentCycle}
            minSubscriptionPeriod={minSubscriptionPeriod}
            setMinSubscriptionPeriod={setMinSubscriptionPeriod}
            hasCancellationFee={hasCancellationFee}
            setHasCancellationFee={setHasCancellationFee}
            cancellationFee={cancellationFee}
            setCancellationFee={setCancellationFee}
            errors={errors}
            setErrors={setErrors}
            touched={touched}
            setTouched={setTouched}
          />

          {/* 재고 섹션 */}
          <StockSection
            productType={productType}
            useStockManagement={useStockManagement}
            setUseStockManagement={setUseStockManagement}
            stockQuantity={stockQuantity}
            setStockQuantity={setStockQuantity}
            stockType={stockType}
            setStockType={setStockType}
            errors={errors}
            setErrors={setErrors}
            touched={touched}
            setTouched={setTouched}
            optionGroups={optionGroups}
          />

          {/* 노출 설정 섹션 */}
          <DisplaySettingSection
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            showWeb={showWeb}
            setShowWeb={setShowWeb}
            showMobile={showMobile}
            setShowMobile={setShowMobile}
            showExternalMarket={showExternalMarket}
            setShowExternalMarket={setShowExternalMarket}
            externalMarketId={externalMarketId}
            setExternalMarketId={setExternalMarketId}
            isMarketConnecting={isMarketConnecting}
            setIsMarketConnecting={setIsMarketConnecting}
            errors={errors}
            setErrors={setErrors}
            touched={touched}
            setTouched={setTouched}
          />

          {/* 배송 정보 섹션 */}
          <DeliverySection
            productType={productType}
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            deliveryFee={deliveryFee}
            setDeliveryFee={setDeliveryFee}
            remoteAreaFee={remoteAreaFee}
            setRemoteAreaFee={setRemoteAreaFee}
            conditionalAmount={conditionalAmount}
            setConditionalAmount={setConditionalAmount}
            errors={errors}
            setErrors={setErrors}
            touched={touched}
            setTouched={setTouched}
          />

          {/* 버튼 영역 */}
          <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 rounded-lg shadow-lg">
            <div className="flex gap-4 justify-between items-center">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                >
                  초기화
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-4 py-2 border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
                >
                  미리보기
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isMarketConnecting}
                  className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium text-lg"
                >
                  {isSubmitting ? '처리 중...' : formMode === 'create' ? '상품 등록' : '상품 수정'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* 미리보기 모달 */}
        {showPreview && previewData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">상품 미리보기</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-600 hover:text-gray-800 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700">기본 정보</h4>
                  <p>
                    <strong>상품명:</strong> {previewData.productName || '(미입력)'}
                  </p>
                  <p>
                    <strong>상품 코드:</strong> {previewData.productCode || '(미입력)'}
                  </p>
                  <p>
                    <strong>상품 유형:</strong> {previewData.productType}
                  </p>
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700">가격 정보</h4>
                  {previewData.productType === '단일' && (
                    <>
                      <p>
                        <strong>판매가:</strong> {previewData.salePrice.toLocaleString()}원
                      </p>
                      <p>
                        <strong>할인율:</strong> {previewData.discountRate}%
                      </p>
                      <p>
                        <strong>최종가:</strong> {previewData.finalPrice.toLocaleString()}원
                      </p>
                    </>
                  )}
                  {previewData.productType === '옵션형' && (
                    <p>
                      <strong>옵션 그룹:</strong> {previewData.optionGroups.length}개
                    </p>
                  )}
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700">재고</h4>
                  <p>
                    <strong>재고 관리:</strong> {previewData.useStockManagement ? '사용' : '미사용'}
                  </p>
                  {previewData.useStockManagement && (
                    <p>
                      <strong>재고 수량:</strong> {previewData.stockQuantity}개
                    </p>
                  )}
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700">노출 채널</h4>
                  <p>
                    {[
                      previewData.showWeb && '웹',
                      previewData.showMobile && '모바일',
                      previewData.showExternalMarket && '외부마켓',
                    ]
                      .filter(Boolean)
                      .join(', ') || '(선택 안함)'}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">배송</h4>
                  <p>
                    <strong>배송 유형:</strong> {previewData.deliveryType}
                  </p>
                  {previewData.deliveryType !== '무료' && (
                    <p>
                      <strong>배송비:</strong> {previewData.deliveryFee.toLocaleString()}원
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplexFormPage;
