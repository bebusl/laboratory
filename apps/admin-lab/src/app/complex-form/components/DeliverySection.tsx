'use client';

import { useState, useEffect } from 'react';

type ProductType = '단일' | '옵션형' | '구독형';
type DeliveryType = '무료' | '유료' | '조건부';

interface DeliverySectionProps {
  productType: ProductType;
  deliveryType: DeliveryType;
  setDeliveryType: (value: DeliveryType) => void;
  deliveryFee: number;
  setDeliveryFee: (value: number) => void;
  remoteAreaFee: number;
  setRemoteAreaFee: (value: number) => void;
  conditionalAmount: number;
  setConditionalAmount: (value: number) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  touched: Record<string, boolean>;
  setTouched: (touched: Record<string, boolean>) => void;
}

const DeliverySection = (props: DeliverySectionProps) => {
  const {
    productType,
    deliveryType,
    setDeliveryType,
    deliveryFee,
    setDeliveryFee,
    remoteAreaFee,
    setRemoteAreaFee,
    conditionalAmount,
    setConditionalAmount,
    errors,
    setErrors,
    touched,
    setTouched,
  } = props;

  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState(3);
  const [deliveryCompany, setDeliveryCompany] = useState('CJ대한통운');
  const [trackingNumberPrefix, setTrackingNumberPrefix] = useState('');
  const [enableSameDayDelivery, setEnableSameDayDelivery] = useState(false);
  const [sameDayDeliveryFee, setSameDayDeliveryFee] = useState(5000);
  const [enableScheduledDelivery, setEnableScheduledDelivery] = useState(false);
  const [packageSize, setPackageSize] = useState<'소' | '중' | '대'>('중');
  const [packageWeight, setPackageWeight] = useState(0);
  const [fragile, setFragile] = useState(false);
  const [returnAddress, setReturnAddress] = useState('');
  const [returnFeePolicy, setReturnFeePolicy] = useState<'고객부담' | '판매자부담' | '무료'>(
    '고객부담'
  );

  const deliveryCompanies = [
    'CJ대한통운',
    '우체국택배',
    '롯데택배',
    'GS Postbox',
    '한진택배',
    'DHL',
    'FedEx',
    '쿠팡로켓배송',
  ];

  // Validation
  const validateConditionalAmount = (value: number) => {
    const newErrors = { ...errors };

    if (deliveryType === '조건부' && !value) {
      newErrors.conditionalAmount = '조건부 배송비는 금액 조건이 필수입니다.';
    } else if (deliveryType === '조건부' && value < 10000) {
      newErrors.conditionalAmount = '무료 배송 조건은 최소 10,000원 이상이어야 합니다.';
    } else {
      delete newErrors.conditionalAmount;
    }

    setErrors(newErrors);
  };

  const handleConditionalAmountChange = (value: number) => {
    setConditionalAmount(value);
    setTouched({ ...touched, conditionalAmount: true });
    validateConditionalAmount(value);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  return (
    <section className="border p-6 rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">5. 배송 정보</h2>

      {productType === '구독형' ? (
        <div className="p-6 bg-gray-100 rounded border-2 border-gray-300 text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-gray-700 font-medium mb-2">
            구독형 상품은 배송 설정을 사용하지 않습니다.
          </p>
          <p className="text-sm text-gray-600">
            구독형 상품의 배송은 구독 정책에 따라 별도로 관리됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 배송 유형 */}
          <div>
            <label className="block font-medium mb-2">배송 유형</label>
            <div className="grid grid-cols-3 gap-3">
              {(['무료', '유료', '조건부'] as DeliveryType[]).map(type => (
                <label
                  key={type}
                  className={`flex flex-col items-center p-4 border-2 rounded cursor-pointer transition-all ${
                    deliveryType === type
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={type}
                    checked={deliveryType === type}
                    onChange={e => setDeliveryType(e.target.value as DeliveryType)}
                    className="mb-2"
                  />
                  <span className="font-medium text-lg">{type} 배송</span>
                  <span className="text-xs text-gray-600 mt-1 text-center">
                    {type === '무료' && '모든 주문에 무료 배송'}
                    {type === '유료' && '배송비 고객 부담'}
                    {type === '조건부' && '조건 충족 시 무료'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 배송비 설정 */}
          {(deliveryType === '유료' || deliveryType === '조건부') && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-4">
              <div>
                <label className="block font-medium mb-1">
                  배송비 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={e => setDeliveryFee(Number(e.target.value))}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="원"
                    step="100"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setDeliveryFee(2500)}
                      className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                      2,500원
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryFee(3000)}
                      className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                      3,000원
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryFee(5000)}
                      className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                      5,000원
                    </button>
                  </div>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    고객이 부담하는 기본 배송비:{' '}
                    <strong className="text-blue-700">{formatPrice(deliveryFee)}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">도서산간 추가비</label>
                <input
                  type="number"
                  value={remoteAreaFee}
                  onChange={e => setRemoteAreaFee(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="원 (선택사항)"
                  step="100"
                />
                {remoteAreaFee > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    도서산간 지역 추가 비용:{' '}
                    <strong className="text-orange-700">{formatPrice(remoteAreaFee)}</strong>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  제주도 및 도서산간 지역 배송 시 추가되는 비용입니다.
                </p>
              </div>
            </div>
          )}

          {/* 조건부 배송 설정 */}
          {deliveryType === '조건부' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <div>
                <label className="block font-medium mb-1">
                  무료 배송 조건 금액 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={conditionalAmount}
                    onChange={e => handleConditionalAmountChange(Number(e.target.value))}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="원 이상 구매 시 무료"
                    step="1000"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleConditionalAmountChange(30000)}
                      className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                      30,000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConditionalAmountChange(50000)}
                      className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                      50,000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConditionalAmountChange(100000)}
                      className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                    >
                      100,000
                    </button>
                  </div>
                </div>

                {errors.conditionalAmount && touched.conditionalAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.conditionalAmount}</p>
                )}

                {conditionalAmount > 0 && (
                  <div className="mt-3 p-3 bg-white border rounded">
                    <p className="text-sm font-medium mb-2">배송비 정책</p>
                    <div className="space-y-1 text-sm">
                      <p>
                        • 구매 금액{' '}
                        <strong className="text-red-600">
                          {formatPrice(conditionalAmount)} 미만
                        </strong>
                        : 배송비 <strong>{formatPrice(deliveryFee)}</strong> 부과
                      </p>
                      <p>
                        • 구매 금액{' '}
                        <strong className="text-green-600">
                          {formatPrice(conditionalAmount)} 이상
                        </strong>
                        :<strong className="text-green-700"> 무료 배송</strong>
                      </p>
                      {remoteAreaFee > 0 && (
                        <p className="text-xs text-gray-600 mt-2">
                          * 도서산간 지역은 조건 충족 시에도 추가비 {formatPrice(remoteAreaFee)}{' '}
                          부과
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 배송 상세 설정 */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">배송 상세 설정</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">배송 회사</label>
                <select
                  value={deliveryCompany}
                  onChange={e => setDeliveryCompany(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {deliveryCompanies.map(company => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">예상 배송 기간</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={estimatedDeliveryDays}
                    onChange={e => setEstimatedDeliveryDays(Number(e.target.value))}
                    className="w-32 border rounded px-3 py-2"
                    min="1"
                  />
                  <span>일</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  고객에게 안내되는 예상 배송 소요 시간입니다.
                </p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableSameDayDelivery}
                    onChange={e => setEnableSameDayDelivery(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">당일배송 옵션 제공</span>
                </label>

                {enableSameDayDelivery && (
                  <div className="ml-6 mt-2 p-3 bg-purple-50 border border-purple-200 rounded">
                    <label className="block text-xs font-medium mb-1">당일배송 추가 비용</label>
                    <input
                      type="number"
                      value={sameDayDeliveryFee}
                      onChange={e => setSameDayDeliveryFee(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1 text-sm"
                      step="1000"
                    />
                    <p className="text-xs text-purple-700 mt-1">
                      오후 2시 이전 주문 시 당일 배송 가능 (추가 비용:{' '}
                      {formatPrice(sameDayDeliveryFee)})
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableScheduledDelivery}
                    onChange={e => setEnableScheduledDelivery(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">예약배송 (날짜/시간 지정) 가능</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">포장 크기</label>
                <div className="flex gap-2">
                  {(['소', '중', '대'] as ('소' | '중' | '대')[]).map(size => (
                    <label
                      key={size}
                      className={`flex-1 flex items-center justify-center p-3 border rounded cursor-pointer ${
                        packageSize === size ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={size}
                        checked={packageSize === size}
                        onChange={e => setPackageSize(e.target.value as '소' | '중' | '대')}
                        className="mr-2"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {packageSize === '소' && '30cm x 20cm x 10cm 이하'}
                  {packageSize === '중' && '50cm x 40cm x 30cm 이하'}
                  {packageSize === '대' && '100cm x 80cm x 60cm 이하'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">포장 무게 (kg)</label>
                <input
                  type="number"
                  value={packageWeight}
                  onChange={e => setPackageWeight(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={fragile}
                    onChange={e => setFragile(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">파손주의 (취급주의 스티커 부착)</span>
                </label>
              </div>
            </div>
          </div>

          {/* 반품 정책 */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">반품/교환 정보</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">반품 주소</label>
                <input
                  type="text"
                  value={returnAddress}
                  onChange={e => setReturnAddress(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="반품 시 상품을 보내실 주소를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">반품 배송비 정책</label>
                <div className="space-y-2">
                  {(['고객부담', '판매자부담', '무료'] as (typeof returnFeePolicy)[]).map(
                    policy => (
                      <label
                        key={policy}
                        className={`flex items-center p-3 border rounded cursor-pointer ${
                          returnFeePolicy === policy
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={policy}
                          checked={returnFeePolicy === policy}
                          onChange={e =>
                            setReturnFeePolicy(e.target.value as typeof returnFeePolicy)
                          }
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium text-sm">{policy}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {policy === '고객부담' &&
                              '단순 변심 시 고객이 반품 배송비를 부담합니다.'}
                            {policy === '판매자부담' && '모든 반품 배송비를 판매자가 부담합니다.'}
                            {policy === '무료' && '반품 배송비가 무료입니다.'}
                          </div>
                        </div>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 배송 정보 요약 */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">배송 정보 요약</h3>

            <div className="p-4 bg-gray-50 border rounded space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">배송 유형</span>
                <span className="font-medium">{deliveryType} 배송</span>
              </div>

              {(deliveryType === '유료' || deliveryType === '조건부') && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-700">기본 배송비</span>
                    <span className="font-medium">{formatPrice(deliveryFee)}</span>
                  </div>

                  {deliveryType === '조건부' && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">무료 배송 조건</span>
                      <span className="font-medium text-green-600">
                        {formatPrice(conditionalAmount)} 이상
                      </span>
                    </div>
                  )}

                  {remoteAreaFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">도서산간 추가비</span>
                      <span className="font-medium text-orange-600">
                        {formatPrice(remoteAreaFee)}
                      </span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between">
                <span className="text-gray-700">배송 회사</span>
                <span className="font-medium">{deliveryCompany}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">예상 배송 기간</span>
                <span className="font-medium">{estimatedDeliveryDays}일</span>
              </div>

              {enableSameDayDelivery && (
                <div className="flex justify-between">
                  <span className="text-gray-700">당일배송</span>
                  <span className="font-medium text-purple-600">
                    가능 (+{formatPrice(sameDayDeliveryFee)})
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-700">포장</span>
                <span className="font-medium">
                  {packageSize} ({packageWeight}kg)
                  {fragile && ' / 파손주의'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-700">반품 배송비</span>
                <span className="font-medium">{returnFeePolicy}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeliverySection;
