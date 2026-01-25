'use client';

import { useState, useEffect } from 'react';

type ProductType = '단일' | '옵션형' | '구독형';
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

interface PricePolicySectionProps {
  productType: ProductType;
  // 단일 상품 props
  salePrice: number;
  setSalePrice: (value: number) => void;
  discountRate: number;
  setDiscountRate: (value: number) => void;
  finalPrice: number;
  setFinalPrice: (value: number) => void;
  // 옵션형 props
  optionGroups: OptionGroup[];
  setOptionGroups: (groups: OptionGroup[]) => void;
  minPrice: number;
  setMinPrice: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  // 구독형 props
  paymentCycle: CycleType;
  setPaymentCycle: (value: CycleType) => void;
  minSubscriptionPeriod: number;
  setMinSubscriptionPeriod: (value: number) => void;
  hasCancellationFee: boolean;
  setHasCancellationFee: (value: boolean) => void;
  cancellationFee: number;
  setCancellationFee: (value: number) => void;
  // 공통 props
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  touched: Record<string, boolean>;
  setTouched: (touched: Record<string, boolean>) => void;
}

const PricePolicySection = (props: PricePolicySectionProps) => {
  const {
    productType,
    salePrice,
    setSalePrice,
    discountRate,
    setDiscountRate,
    finalPrice,
    setFinalPrice,
    optionGroups,
    setOptionGroups,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    paymentCycle,
    setPaymentCycle,
    minSubscriptionPeriod,
    setMinSubscriptionPeriod,
    hasCancellationFee,
    setHasCancellationFee,
    cancellationFee,
    setCancellationFee,
    errors,
    setErrors,
    touched,
    setTouched,
  } = props;

  // 내부 상태들 (더 더러운 코드를 위해)
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [discountHistory, setDiscountHistory] = useState<number[]>([]);
  const [salePriceBuffer, setSalePriceBuffer] = useState<string>('');
  const [discountRateBuffer, setDiscountRateBuffer] = useState<string>('');
  const [isPriceCalculating, setIsPriceCalculating] = useState(false);
  const [priceCalculationCount, setPriceCalculationCount] = useState(0);
  const [recommendedPrice, setRecommendedPrice] = useState(0);
  const [showPriceRecommendation, setShowPriceRecommendation] = useState(false);
  const [priceComparisonData, setPriceComparisonData] = useState<
    { market: string; price: number }[]
  >([]);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);
  const [lastDiscountUpdate, setLastDiscountUpdate] = useState<Date | null>(null);

  // 구독형 관련 내부 상태
  const [subscriptionDuration, setSubscriptionDuration] = useState(0);
  const [totalSubscriptionAmount, setTotalSubscriptionAmount] = useState(0);
  const [averageMonthlyAmount, setAverageMonthlyAmount] = useState(0);
  const [subscriptionDiscount, setSubscriptionDiscount] = useState(0);
  const [showSubscriptionCalculator, setShowSubscriptionCalculator] = useState(false);
  const [cancellationFeeRate, setCancellationFeeRate] = useState(0);
  const [estimatedRevenue, setEstimatedRevenue] = useState(0);

  // 옵션 관련 내부 상태
  const [optionGroupsCount, setOptionGroupsCount] = useState(0);
  const [totalOptionsCount, setTotalOptionsCount] = useState(0);
  const [averageOptionPrice, setAverageOptionPrice] = useState(0);
  const [mostExpensiveOption, setMostExpensiveOption] = useState<OptionItem | null>(null);
  const [cheapestOption, setCheapestOption] = useState<OptionItem | null>(null);
  const [outOfStockOptions, setOutOfStockOptions] = useState<OptionItem[]>([]);
  const [lowStockOptions, setLowStockOptions] = useState<OptionItem[]>([]);
  const [showOptionStatistics, setShowOptionStatistics] = useState(false);
  const [optionPriceWarnings, setOptionPriceWarnings] = useState<string[]>([]);

  // 가격 히스토리 추적
  useEffect(() => {
    if (salePrice > 0 && priceHistory[priceHistory.length - 1] !== salePrice) {
      setPriceHistory([...priceHistory, salePrice]);
      setLastPriceUpdate(new Date());
    }
  }, [salePrice]);

  useEffect(() => {
    if (discountRate > 0 && discountHistory[discountHistory.length - 1] !== discountRate) {
      setDiscountHistory([...discountHistory, discountRate]);
      setLastDiscountUpdate(new Date());
    }
  }, [discountRate]);

  // 최종가 자동 계산
  useEffect(() => {
    if (productType === '단일' && salePrice > 0) {
      setIsPriceCalculating(true);

      setTimeout(() => {
        const calculated = salePrice * (1 - discountRate / 100);
        setFinalPrice(Math.floor(calculated));
        setPriceCalculationCount(priceCalculationCount + 1);
        setIsPriceCalculating(false);
      }, 100);
    }
  }, [salePrice, discountRate, productType]);

  // 옵션 가격 범위 계산
  useEffect(() => {
    if (productType === '옵션형' && optionGroups.length > 0) {
      let min = Infinity;
      let max = -Infinity;
      let sum = 0;
      let count = 0;

      optionGroups.forEach(group => {
        group.options.forEach(option => {
          if (option.additionalPrice < min) {
            min = option.additionalPrice;
            setCheapestOption(option);
          }
          if (option.additionalPrice > max) {
            max = option.additionalPrice;
            setMostExpensiveOption(option);
          }
          sum += option.additionalPrice;
          count++;
        });
      });

      setMinPrice(min === Infinity ? 0 : min);
      setMaxPrice(max === -Infinity ? 0 : max);
      setAverageOptionPrice(count > 0 ? Math.floor(sum / count) : 0);
    }
  }, [optionGroups, productType]);

  // 옵션 통계 업데이트
  useEffect(() => {
    if (productType === '옵션형') {
      setOptionGroupsCount(optionGroups.length);

      let totalCount = 0;
      const outOfStock: OptionItem[] = [];
      const lowStock: OptionItem[] = [];

      optionGroups.forEach(group => {
        totalCount += group.options.length;
        group.options.forEach(option => {
          if (option.stock === 0) {
            outOfStock.push(option);
          } else if (option.stock < 10) {
            lowStock.push(option);
          }
        });
      });

      setTotalOptionsCount(totalCount);
      setOutOfStockOptions(outOfStock);
      setLowStockOptions(lowStock);
    }
  }, [optionGroups, productType]);

  // 옵션 가격 경고
  useEffect(() => {
    if (productType === '옵션형' && optionGroups.length > 0) {
      const warnings: string[] = [];

      // 옵션 간 가격 차이가 너무 큰 경우
      if (maxPrice - minPrice > 100000) {
        warnings.push(
          '옵션 간 가격 차이가 매우 큽니다. 고객 혼란을 방지하기 위해 재검토를 권장합니다.'
        );
      }

      // 음수 가격 옵션
      const negativeOptions = optionGroups
        .flatMap(g => g.options)
        .filter(o => o.additionalPrice < 0);
      if (negativeOptions.length > 0) {
        warnings.push(`음수 추가 금액 옵션이 ${negativeOptions.length}개 있습니다.`);
      }

      // 중복 옵션명
      const optionNames = optionGroups.flatMap(g => g.options).map(o => o.name);
      const duplicates = optionNames.filter((name, index) => optionNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        warnings.push(`중복된 옵션명이 있습니다: ${[...new Set(duplicates)].join(', ')}`);
      }

      setOptionPriceWarnings(warnings);
    } else {
      setOptionPriceWarnings([]);
    }
  }, [optionGroups, minPrice, maxPrice, productType]);

  // 구독 금액 계산
  useEffect(() => {
    if (productType === '구독형' && minSubscriptionPeriod > 0) {
      let monthlyMultiplier = 1;

      switch (paymentCycle) {
        case '주':
          monthlyMultiplier = 4.33; // 평균 주/월
          break;
        case '월':
          monthlyMultiplier = 1;
          break;
        case '년':
          monthlyMultiplier = 1 / 12;
          break;
      }

      const totalMonths =
        minSubscriptionPeriod * (paymentCycle === '주' ? 4.33 : paymentCycle === '월' ? 1 : 12);
      setSubscriptionDuration(Math.floor(totalMonths));

      // 가상의 구독 금액 계산 (실제로는 salePrice 등을 사용해야 하지만...)
      const basePrice = salePrice || 10000;
      setTotalSubscriptionAmount(basePrice * totalMonths);
      setAverageMonthlyAmount(basePrice);
    }
  }, [productType, paymentCycle, minSubscriptionPeriod, salePrice]);

  // 해지 위약금 비율 계산
  useEffect(() => {
    if (hasCancellationFee && cancellationFee > 0 && salePrice > 0) {
      const rate = (cancellationFee / salePrice) * 100;
      setCancellationFeeRate(Math.floor(rate * 100) / 100);
    } else {
      setCancellationFeeRate(0);
    }
  }, [hasCancellationFee, cancellationFee, salePrice]);

  // 추정 매출 계산
  useEffect(() => {
    if (productType === '구독형') {
      const revenue = totalSubscriptionAmount * 0.7; // 가상의 유지율 70%
      setEstimatedRevenue(Math.floor(revenue));
    }
  }, [productType, totalSubscriptionAmount]);

  // 가격 추천 로직
  useEffect(() => {
    if (productType === '단일' && salePrice > 0) {
      // 시장 가격 비교 (가상 데이터)
      const marketPrices = [
        { market: '경쟁사 A', price: salePrice * 0.9 },
        { market: '경쟁사 B', price: salePrice * 1.1 },
        { market: '경쟁사 C', price: salePrice * 0.95 },
      ];

      setPriceComparisonData(marketPrices);

      // 추천 가격 계산
      const avgMarketPrice =
        marketPrices.reduce((sum, m) => sum + m.price, 0) / marketPrices.length;
      setRecommendedPrice(Math.floor(avgMarketPrice));
    }
  }, [salePrice, productType]);

  // Validation
  const validateSalePrice = (value: number) => {
    const newErrors = { ...errors };

    if (value <= 0) {
      newErrors.salePrice = '판매가는 0보다 커야 합니다.';
    } else if (value > 10000000) {
      newErrors.salePrice = '판매가는 1천만원을 초과할 수 없습니다.';
    } else if (value % 10 !== 0) {
      newErrors.salePrice = '판매가는 10원 단위로 입력해주세요.';
    } else {
      delete newErrors.salePrice;
    }

    setErrors(newErrors);
  };

  const validateDiscountRate = (value: number) => {
    const newErrors = { ...errors };

    if (value < 0) {
      newErrors.discountRate = '할인율은 0 이상이어야 합니다.';
    } else if (value > 100) {
      newErrors.discountRate = '할인율은 100% 이하여야 합니다.';
    } else if (value > 70) {
      newErrors.discountRate = '70%를 초과하는 할인은 검토가 필요합니다.';
    } else {
      delete newErrors.discountRate;
    }

    setErrors(newErrors);
  };

  const handleSalePriceChange = (value: string) => {
    setSalePriceBuffer(value);
    const numValue = Number(value);

    if (!isNaN(numValue)) {
      setSalePrice(numValue);
      setTouched({ ...touched, salePrice: true });
      validateSalePrice(numValue);
    }
  };

  const handleDiscountRateChange = (value: string) => {
    setDiscountRateBuffer(value);
    const numValue = Number(value);

    if (!isNaN(numValue)) {
      setDiscountRate(numValue);
      setTouched({ ...touched, discountRate: true });
      validateDiscountRate(numValue);
    }
  };

  // 옵션 그룹 관리
  const addOptionGroup = () => {
    const newGroup: OptionGroup = {
      id: Date.now().toString(),
      name: '',
      selectionType: '단일',
      options: [],
    };
    setOptionGroups([...optionGroups, newGroup]);
  };

  const addOptionItem = (groupId: string) => {
    const newItem: OptionItem = {
      id: Date.now().toString() + Math.random(),
      name: '',
      additionalPrice: 0,
      stock: 0,
    };

    setOptionGroups(
      optionGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            options: [...group.options, newItem],
          };
        }
        return group;
      })
    );
  };

  const updateOptionGroup = (groupId: string, field: string, value: any) => {
    setOptionGroups(
      optionGroups.map(group => {
        if (group.id === groupId) {
          return { ...group, [field]: value };
        }
        return group;
      })
    );
  };

  const updateOptionItem = (groupId: string, itemId: string, field: string, value: any) => {
    setOptionGroups(
      optionGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.map(item => {
              if (item.id === itemId) {
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return group;
      })
    );
  };

  const removeOptionGroup = (groupId: string) => {
    if (confirm('이 옵션 그룹을 삭제하시겠습니까?')) {
      setOptionGroups(optionGroups.filter(group => group.id !== groupId));
    }
  };

  const removeOptionItem = (groupId: string, itemId: string) => {
    setOptionGroups(
      optionGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            options: group.options.filter(item => item.id !== itemId),
          };
        }
        return group;
      })
    );
  };

  const duplicateOptionGroup = (groupId: string) => {
    const groupToDuplicate = optionGroups.find(g => g.id === groupId);
    if (groupToDuplicate) {
      const newGroup: OptionGroup = {
        ...groupToDuplicate,
        id: Date.now().toString(),
        name: groupToDuplicate.name + ' (복사)',
        options: groupToDuplicate.options.map(opt => ({
          ...opt,
          id: Date.now().toString() + Math.random(),
        })),
      };
      setOptionGroups([...optionGroups, newGroup]);
    }
  };

  const moveOptionGroupUp = (groupId: string) => {
    const index = optionGroups.findIndex(g => g.id === groupId);
    if (index > 0) {
      const newGroups = [...optionGroups];
      [newGroups[index - 1], newGroups[index]] = [newGroups[index], newGroups[index - 1]];
      setOptionGroups(newGroups);
    }
  };

  const moveOptionGroupDown = (groupId: string) => {
    const index = optionGroups.findIndex(g => g.id === groupId);
    if (index < optionGroups.length - 1) {
      const newGroups = [...optionGroups];
      [newGroups[index], newGroups[index + 1]] = [newGroups[index + 1], newGroups[index]];
      setOptionGroups(newGroups);
    }
  };

  // 가격 포맷팅 헬퍼
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const getPriceColor = (price: number) => {
    if (price === 0) return 'text-gray-500';
    if (price < 10000) return 'text-green-600';
    if (price < 50000) return 'text-blue-600';
    if (price < 100000) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDiscountColor = (rate: number) => {
    if (rate === 0) return 'text-gray-500';
    if (rate < 10) return 'text-green-600';
    if (rate < 30) return 'text-blue-600';
    if (rate < 50) return 'text-orange-600';
    if (rate < 70) return 'text-red-600';
    return 'text-red-800';
  };

  // 가격 히스토리 표시
  const renderPriceHistory = () => {
    if (priceHistory.length === 0) return null;

    return (
      <div className="mt-2 p-2 bg-gray-50 border rounded">
        <p className="text-xs text-gray-600 mb-1">가격 변경 이력</p>
        <div className="text-xs text-gray-700 space-y-1">
          {priceHistory.slice(-5).map((price, index) => (
            <div key={index}>
              {index + 1}. {formatPrice(price)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="border p-6 rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">2. 가격 정책</h2>

      {/* 단일 상품 */}
      {productType === '단일' && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                판매가 <span className="text-red-500">*</span>
              </label>
              {showPriceRecommendation && recommendedPrice > 0 && (
                <button
                  type="button"
                  onClick={() => setSalePrice(recommendedPrice)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  추천 가격 적용 ({formatPrice(recommendedPrice)})
                </button>
              )}
            </div>

            <input
              type="number"
              value={salePrice || ''}
              onChange={e => handleSalePriceChange(e.target.value)}
              disabled={optionGroups.length > 0}
              className={`w-full border rounded px-3 py-2 disabled:bg-gray-100 ${getPriceColor(salePrice)}`}
              placeholder="원 (10원 단위)"
            />

            {optionGroups.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                ⚠ 옵션이 있으면 단일 가격을 설정할 수 없습니다.
              </p>
            )}

            {touched.salePrice && errors.salePrice && (
              <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>
            )}

            {salePrice > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">현재 판매가</span>
                  <span className={`font-medium ${getPriceColor(salePrice)}`}>
                    {formatPrice(salePrice)}
                  </span>
                </div>

                {lastPriceUpdate && (
                  <div className="text-xs text-gray-500">
                    마지막 수정: {lastPriceUpdate.toLocaleString()}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowPriceHistory(!showPriceHistory)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {showPriceHistory ? '가격 이력 숨기기' : '가격 이력 보기'} ({priceHistory.length}
                  개)
                </button>

                {showPriceHistory && renderPriceHistory()}
              </div>
            )}

            {priceComparisonData.length > 0 && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium mb-2">시장 가격 비교</p>
                {priceComparisonData.map((data, index) => (
                  <div key={index} className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">{data.market}</span>
                    <span className="font-medium">{formatPrice(data.price)}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-blue-300">
                  <div className="flex justify-between text-xs font-medium">
                    <span>추천 가격</span>
                    <span className="text-blue-700">{formatPrice(recommendedPrice)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriceRecommendation(!showPriceRecommendation)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  {showPriceRecommendation ? '추천 숨기기' : '추천 보기'}
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">할인율 (%)</label>
            <input
              type="number"
              value={discountRate || ''}
              onChange={e => handleDiscountRateChange(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${getDiscountColor(discountRate)}`}
              min="0"
              max="100"
              step="1"
            />

            {touched.discountRate && errors.discountRate && (
              <p className="text-red-500 text-sm mt-1">{errors.discountRate}</p>
            )}

            {discountRate > 0 && (
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">할인율</span>
                  <span className={`font-medium ${getDiscountColor(discountRate)}`}>
                    {discountRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">할인 금액</span>
                  <span className="font-medium text-red-600">
                    -{formatPrice((salePrice * discountRate) / 100)}
                  </span>
                </div>

                {discountRate > 50 && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      ⚠ 50%가 넘는 높은 할인율입니다. 수익성을 검토해주세요.
                    </p>
                  </div>
                )}

                {discountRate > 70 && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-800">
                      ⛔ 70%를 초과하는 할인은 승인이 필요합니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">최종가</label>
            <div className="relative">
              <input
                type="number"
                value={finalPrice || ''}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-50 font-bold text-lg"
              />
              {isPriceCalculating && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            <div className="mt-2 space-y-2">
              <p className="text-gray-500 text-sm">
                자동 계산됨 (계산 횟수: {priceCalculationCount}회)
              </p>

              {finalPrice > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">판매가</span>
                      <span className="font-medium">{formatPrice(salePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">할인 ({discountRate}%)</span>
                      <span className="font-medium text-red-600">
                        -{formatPrice((salePrice * discountRate) / 100)}
                      </span>
                    </div>
                    <div className="border-t border-green-300 pt-1 mt-1"></div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">최종 판매가</span>
                      <span className="font-bold text-green-700 text-lg">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {finalPrice > 0 && salePrice > 0 && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-gray-600">원가 대비</div>
                    <div className="font-medium">
                      {((finalPrice / salePrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-gray-600">절약 금액</div>
                    <div className="font-medium text-red-600">
                      {formatPrice(salePrice - finalPrice)}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-gray-600">고객 혜택</div>
                    <div className="font-medium text-blue-600">{discountRate}% OFF</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 옵션형 상품 - 다음 섹션에서 계속... */}
      {productType === '옵션형' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">옵션 그룹 관리</h3>
              <p className="text-sm text-gray-600 mt-1">
                상품의 색상, 사이즈 등 다양한 옵션을 그룹으로 관리할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={addOptionGroup}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            >
              + 옵션 그룹 추가
            </button>
          </div>

          {/* 옵션 통계 */}
          {optionGroups.length > 0 && (
            <div className="grid grid-cols-4 gap-3 p-4 bg-blue-50 border border-blue-200 rounded">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{optionGroupsCount}</div>
                <div className="text-xs text-gray-600">옵션 그룹</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{totalOptionsCount}</div>
                <div className="text-xs text-gray-600">전체 옵션</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{outOfStockOptions.length}</div>
                <div className="text-xs text-gray-600">품절 옵션</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-700">{lowStockOptions.length}</div>
                <div className="text-xs text-gray-600">재고 부족</div>
              </div>
            </div>
          )}

          {/* 옵션 경고 */}
          {optionPriceWarnings.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-medium text-yellow-800 text-sm mb-2">⚠ 주의사항</p>
              <ul className="list-disc list-inside text-xs text-yellow-700 space-y-1">
                {optionPriceWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 옵션 그룹 리스트 */}
          <div className="space-y-4">
            {optionGroups.map((group, groupIndex) => (
              <OptionGroupComponent
                key={group.id}
                group={group}
                groupIndex={groupIndex}
                totalGroups={optionGroups.length}
                onUpdate={updateOptionGroup}
                onRemove={removeOptionGroup}
                onDuplicate={duplicateOptionGroup}
                onMoveUp={moveOptionGroupUp}
                onMoveDown={moveOptionGroupDown}
                onAddItem={addOptionItem}
                onUpdateItem={updateOptionItem}
                onRemoveItem={removeOptionItem}
              />
            ))}
          </div>

          {optionGroups.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-2">아직 옵션 그룹이 없습니다.</p>
              <p className="text-sm text-gray-400">
                위의 "옵션 그룹 추가" 버튼을 클릭하여 시작하세요.
              </p>
            </div>
          )}

          {optionGroups.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-700 font-medium mb-2">가격 정보</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">최저 가격</span>
                      <span className="font-bold text-green-700">{formatPrice(minPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">최고 가격</span>
                      <span className="font-bold text-red-700">{formatPrice(maxPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">평균 가격</span>
                      <span className="font-bold text-blue-700">
                        {formatPrice(averageOptionPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">가격 범위</span>
                      <span className="font-bold">{formatPrice(maxPrice - minPrice)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 font-medium mb-2">재고 정보</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">전체 옵션</span>
                      <span className="font-bold">{totalOptionsCount}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">판매 가능</span>
                      <span className="font-bold text-green-600">
                        {totalOptionsCount - outOfStockOptions.length}개
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">품절</span>
                      <span className="font-bold text-red-600">{outOfStockOptions.length}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">재고 부족 (10개 미만)</span>
                      <span className="font-bold text-orange-600">{lowStockOptions.length}개</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowOptionStatistics(!showOptionStatistics)}
                className="mt-3 w-full text-xs text-blue-600 hover:text-blue-800"
              >
                {showOptionStatistics ? '상세 통계 숨기기' : '상세 통계 보기'}
              </button>

              {showOptionStatistics && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs font-medium mb-2">옵션별 상세 정보</p>
                  {mostExpensiveOption && (
                    <div className="mb-2 p-2 bg-white rounded text-xs">
                      <span className="text-gray-600">최고가 옵션: </span>
                      <span className="font-medium">{mostExpensiveOption.name}</span>
                      <span className="text-red-600 ml-2">
                        {formatPrice(mostExpensiveOption.additionalPrice)}
                      </span>
                    </div>
                  )}
                  {cheapestOption && (
                    <div className="p-2 bg-white rounded text-xs">
                      <span className="text-gray-600">최저가 옵션: </span>
                      <span className="font-medium">{cheapestOption.name}</span>
                      <span className="text-green-600 ml-2">
                        {formatPrice(cheapestOption.additionalPrice)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {errors.options && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{errors.options}</p>
            </div>
          )}
        </div>
      )}

      {/* 구독형 상품 */}
      {productType === '구독형' && (
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2">
              결제 주기 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['주', '월', '년'] as CycleType[]).map(cycle => (
                <label
                  key={cycle}
                  className={`flex items-center justify-center p-4 border rounded cursor-pointer transition-all ${
                    paymentCycle === cycle
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={cycle}
                    checked={paymentCycle === cycle}
                    onChange={e => setPaymentCycle(e.target.value as CycleType)}
                    className="mr-2"
                  />
                  <span className="font-medium">{cycle}간 결제</span>
                </label>
              ))}
            </div>

            {paymentCycle && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="text-blue-800">
                  선택된 결제 주기: <strong>{paymentCycle}간</strong>
                  {paymentCycle === '주' && ' (약 4주마다 결제)'}
                  {paymentCycle === '월' && ' (매월 결제)'}
                  {paymentCycle === '년' && ' (매년 결제)'}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              최소 구독 기간 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={minSubscriptionPeriod || ''}
                onChange={e => setMinSubscriptionPeriod(Number(e.target.value))}
                className="w-32 border rounded px-3 py-2"
                min="1"
              />
              <span className="font-medium">{paymentCycle}</span>
            </div>

            {minSubscriptionPeriod > 0 && (
              <div className="mt-2 space-y-2">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">구독 기간</span>
                      <p className="font-medium">
                        {minSubscriptionPeriod} {paymentCycle}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">환산 (개월)</span>
                      <p className="font-medium">{subscriptionDuration}개월</p>
                    </div>
                  </div>
                </div>

                {minSubscriptionPeriod > 12 && paymentCycle === '월' && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                    ⚠ 12개월을 초과하는 구독 기간은 고객 부담이 클 수 있습니다.
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasCancellationFee}
                onChange={e => setHasCancellationFee(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              <span className="font-medium">해지 위약금 적용</span>
            </label>
            <p className="text-sm text-gray-600 mt-1 ml-6">
              구독 최소 기간 내 해지 시 위약금이 부과됩니다.
            </p>
          </div>

          {hasCancellationFee && (
            <div className="ml-6 p-4 bg-orange-50 border border-orange-200 rounded space-y-3">
              <div>
                <label className="block font-medium mb-1">
                  위약금 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={cancellationFee || ''}
                  onChange={e => setCancellationFee(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                  placeholder="원"
                />

                {cancellationFee > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="p-2 bg-white border rounded text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">위약금</span>
                        <span className="font-bold text-orange-700">
                          {formatPrice(cancellationFee)}
                        </span>
                      </div>
                      {salePrice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">상품 가격 대비</span>
                          <span className="font-medium">{cancellationFeeRate}%</span>
                        </div>
                      )}
                    </div>

                    {cancellationFeeRate > 50 && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        ⛔ 위약금이 상품 가격의 50%를 초과합니다. 법적 검토가 필요할 수 있습니다.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-700 space-y-1">
                <p>위약금 적용 조건:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>
                    최소 구독 기간 ({minSubscriptionPeriod} {paymentCycle}) 내 해지 시 적용
                  </li>
                  <li>고객에게 위약금 정책을 명확히 안내해야 합니다</li>
                  <li>환불 규정과 함께 고지되어야 합니다</li>
                </ul>
              </div>
            </div>
          )}

          {/* 구독 계산기 */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowSubscriptionCalculator(!showSubscriptionCalculator)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showSubscriptionCalculator ? '계산기 숨기기' : '구독 수익 계산기'}
            </button>

            {showSubscriptionCalculator && (
              <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded space-y-3">
                <h4 className="font-medium">예상 구독 수익</h4>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-white rounded">
                    <span className="text-gray-600">결제 주기</span>
                    <p className="font-medium">{paymentCycle}간</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <span className="text-gray-600">최소 기간</span>
                    <p className="font-medium">
                      {minSubscriptionPeriod} {paymentCycle}
                    </p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <span className="text-gray-600">월 환산</span>
                    <p className="font-medium">{subscriptionDuration}개월</p>
                  </div>
                  <div className="p-2 bg-white rounded">
                    <span className="text-gray-600">월 평균 금액</span>
                    <p className="font-medium">{formatPrice(averageMonthlyAmount)}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border-2 border-green-400 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">총 구독 금액</span>
                    <span className="text-xl font-bold text-green-700">
                      {formatPrice(totalSubscriptionAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t">
                    <span className="text-gray-700">예상 실제 매출 (유지율 70%)</span>
                    <span className="text-lg font-bold text-blue-700">
                      {formatPrice(estimatedRevenue)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  * 실제 매출은 고객 유지율, 해지율 등에 따라 달라질 수 있습니다.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// 옵션 그룹 컴포넌트 (props drilling의 극치)
interface OptionGroupComponentProps {
  group: OptionGroup;
  groupIndex: number;
  totalGroups: number;
  onUpdate: (groupId: string, field: string, value: any) => void;
  onRemove: (groupId: string) => void;
  onDuplicate: (groupId: string) => void;
  onMoveUp: (groupId: string) => void;
  onMoveDown: (groupId: string) => void;
  onAddItem: (groupId: string) => void;
  onUpdateItem: (groupId: string, itemId: string, field: string, value: any) => void;
  onRemoveItem: (groupId: string, itemId: string) => void;
}

const OptionGroupComponent = (props: OptionGroupComponentProps) => {
  const {
    group,
    groupIndex,
    totalGroups,
    onUpdate,
    onRemove,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onAddItem,
    onUpdateItem,
    onRemoveItem,
  } = props;

  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="border-2 border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-white">
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <h4 className="font-semibold text-lg">
            옵션 그룹 #{groupIndex + 1}
            {group.name && `: ${group.name}`}
          </h4>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {group.options.length}개 옵션
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowActions(!showActions)}
            className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-200"
          >
            ⋮
          </button>

          {showActions && (
            <div className="absolute right-4 mt-24 bg-white border shadow-lg rounded z-10">
              <button
                type="button"
                onClick={() => {
                  onDuplicate(group.id);
                  setShowActions(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                복제
              </button>
              {groupIndex > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onMoveUp(group.id);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  위로 이동
                </button>
              )}
              {groupIndex < totalGroups - 1 && (
                <button
                  type="button"
                  onClick={() => {
                    onMoveDown(group.id);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  아래로 이동
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onRemove(group.id);
                  setShowActions(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">옵션 그룹명</label>
              <input
                type="text"
                value={group.name}
                onChange={e => onUpdate(group.id, 'name', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="예: 색상, 사이즈"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">선택 방식</label>
              <div className="flex gap-4 items-center h-10">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="단일"
                    checked={group.selectionType === '단일'}
                    onChange={e => onUpdate(group.id, 'selectionType', e.target.value)}
                    className="mr-2"
                  />
                  단일 선택
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="다중"
                    checked={group.selectionType === '다중'}
                    onChange={e => onUpdate(group.id, 'selectionType', e.target.value)}
                    className="mr-2"
                  />
                  다중 선택
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">옵션 아이템</label>
              <button
                type="button"
                onClick={() => onAddItem(group.id)}
                className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + 아이템 추가
              </button>
            </div>

            <div className="space-y-2">
              {group.options.map((item, itemIndex) => (
                <div key={item.id} className="flex gap-2 items-center p-2 bg-white border rounded">
                  <span className="text-xs text-gray-500 w-6">{itemIndex + 1}</span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => onUpdateItem(group.id, item.id, 'name', e.target.value)}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    placeholder="옵션명"
                  />
                  <input
                    type="number"
                    value={item.additionalPrice}
                    onChange={e =>
                      onUpdateItem(group.id, item.id, 'additionalPrice', Number(e.target.value))
                    }
                    className="w-32 border rounded px-2 py-1 text-sm"
                    placeholder="추가 금액"
                  />
                  <input
                    type="number"
                    value={item.stock}
                    onChange={e => onUpdateItem(group.id, item.id, 'stock', Number(e.target.value))}
                    className="w-24 border rounded px-2 py-1 text-sm"
                    placeholder="재고"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveItem(group.id, item.id)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 hover:bg-red-50 rounded"
                  >
                    삭제
                  </button>
                </div>
              ))}

              {group.options.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded border border-dashed">
                  <p className="text-sm text-gray-500">아직 옵션이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricePolicySection;
