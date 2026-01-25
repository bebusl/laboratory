'use client';

import { useState, useEffect } from 'react';

type ProductType = '단일' | '옵션형' | '구독형';
type StockType = '자동' | '수동';

interface StockSectionProps {
  productType: ProductType;
  useStockManagement: boolean;
  setUseStockManagement: (value: boolean) => void;
  stockQuantity: number;
  setStockQuantity: (value: number) => void;
  stockType: StockType;
  setStockType: (value: StockType) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  touched: Record<string, boolean>;
  setTouched: (touched: Record<string, boolean>) => void;
  // 옵션 관련 props
  optionGroups: any[];
}

const StockSection = (props: StockSectionProps) => {
  const {
    productType,
    useStockManagement,
    setUseStockManagement,
    stockQuantity,
    setStockQuantity,
    stockType,
    setStockType,
    errors,
    setErrors,
    touched,
    setTouched,
    optionGroups
  } = props;

  const [stockHistory, setStockHistory] = useState<{date: Date, quantity: number, reason: string}[]>([]);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [outOfStockAlert, setOutOfStockAlert] = useState(true);
  const [autoReorder, setAutoReorder] = useState(false);
  const [reorderPoint, setReorderPoint] = useState(5);
  const [reorderQuantity, setReorderQuantity] = useState(50);
  const [showStockHistory, setShowStockHistory] = useState(false);
  const [stockWarningLevel, setStockWarningLevel] = useState<'safe' | 'low' | 'critical' | 'out'>('safe');
  const [estimatedRunoutDays, setEstimatedRunoutDays] = useState(0);
  const [averageDailySales, setAverageDailySales] = useState(5);

  // 재고 레벨 계산
  useEffect(() => {
    if (!useStockManagement) {
      setStockWarningLevel('safe');
      return;
    }

    if (stockQuantity === 0) {
      setStockWarningLevel('out');
    } else if (stockQuantity <= reorderPoint) {
      setStockWarningLevel('critical');
    } else if (stockQuantity <= lowStockThreshold) {
      setStockWarningLevel('low');
    } else {
      setStockWarningLevel('safe');
    }
  }, [stockQuantity, lowStockThreshold, reorderPoint, useStockManagement]);

  // 예상 품절일 계산
  useEffect(() => {
    if (useStockManagement && stockQuantity > 0 && averageDailySales > 0) {
      const days = Math.floor(stockQuantity / averageDailySales);
      setEstimatedRunoutDays(days);
    } else {
      setEstimatedRunoutDays(0);
    }
  }, [stockQuantity, averageDailySales, useStockManagement]);

  // 재고 히스토리 추적
  useEffect(() => {
    if (useStockManagement && stockQuantity >= 0) {
      const lastHistory = stockHistory[stockHistory.length - 1];
      if (!lastHistory || lastHistory.quantity !== stockQuantity) {
        setStockHistory([
          ...stockHistory,
          {
            date: new Date(),
            quantity: stockQuantity,
            reason: '수동 변경'
          }
        ]);
      }
    }
  }, [stockQuantity]);

  // Validation
  const validateStockQuantity = (value: number) => {
    const newErrors = { ...errors };

    if (useStockManagement && productType !== '옵션형') {
      if (value < 0) {
        newErrors.stockQuantity = '재고 수량은 음수일 수 없습니다.';
      } else if (value > 1000000) {
        newErrors.stockQuantity = '재고 수량이 비정상적으로 많습니다.';
      } else {
        delete newErrors.stockQuantity;
      }
    } else {
      delete newErrors.stockQuantity;
    }

    setErrors(newErrors);
  };

  const handleStockQuantityChange = (value: number) => {
    setStockQuantity(value);
    setTouched({ ...touched, stockQuantity: true });
    validateStockQuantity(value);
  };

  const getStockLevelColor = () => {
    switch (stockWarningLevel) {
      case 'out': return 'border-red-500 bg-red-50';
      case 'critical': return 'border-orange-500 bg-orange-50';
      case 'low': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getStockLevelText = () => {
    switch (stockWarningLevel) {
      case 'out': return '품절';
      case 'critical': return '긴급 재고 부족';
      case 'low': return '재고 부족';
      default: return '재고 충분';
    }
  };

  const getStockLevelIcon = () => {
    switch (stockWarningLevel) {
      case 'out': return '🔴';
      case 'critical': return '🟠';
      case 'low': return '🟡';
      default: return '🟢';
    }
  };

  return (
    <section className="border p-6 rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">3. 재고 / 판매 조건</h2>

      <div className="space-y-6">
        <div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useStockManagement}
              onChange={(e) => setUseStockManagement(e.target.checked)}
              className="mr-2 w-5 h-5"
            />
            <span className="font-medium text-lg">재고 관리 사용</span>
          </label>
          <p className="text-sm text-gray-600 mt-1 ml-7">
            재고 관리를 활성화하면 재고 수량을 추적하고 자동으로 품절 처리할 수 있습니다.
          </p>
        </div>

        {useStockManagement && productType !== '옵션형' && (
          <>
            <div className={`p-4 border-2 rounded-lg ${getStockLevelColor()}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getStockLevelIcon()}</span>
                  <span className="font-bold text-lg">{getStockLevelText()}</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{stockQuantity}</div>
                  <div className="text-sm text-gray-600">개</div>
                </div>
              </div>

              {estimatedRunoutDays > 0 && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm">
                    예상 품절일: <strong>{estimatedRunoutDays}일 후</strong>
                    <span className="text-xs text-gray-600 ml-2">
                      (일 평균 판매량: {averageDailySales}개 기준)
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">
                재고 수량 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => handleStockQuantityChange(Number(e.target.value))}
                  className="flex-1 border rounded px-3 py-2 text-lg font-medium"
                  min="0"
                />
                <button
                  type="button"
                  onClick={() => handleStockQuantityChange(stockQuantity + 10)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => handleStockQuantityChange(stockQuantity + 100)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  +100
                </button>
              </div>

              {touched.stockQuantity && errors.stockQuantity && (
                <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
              )}

              {stockQuantity > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-600">안전 재고</div>
                    <div className="font-medium">{lowStockThreshold}개</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-600">재발주 시점</div>
                    <div className="font-medium">{reorderPoint}개</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-xs text-gray-600">재발주 수량</div>
                    <div className="font-medium">{reorderQuantity}개</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-2">품절 처리</label>
              <div className="space-y-2">
                {(['자동', '수동'] as StockType[]).map(type => (
                  <label
                    key={type}
                    className={`flex items-start p-3 border rounded cursor-pointer ${
                      stockType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      checked={stockType === type}
                      onChange={(e) => setStockType(e.target.value as StockType)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-medium">{type} 품절 처리</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {type === '자동'
                          ? '재고가 0이 되면 자동으로 품절 상태로 전환됩니다.'
                          : '재고가 0이 되어도 수동으로 품절 설정을 해야 합니다.'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 고급 설정 */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">고급 재고 설정</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    재고 부족 기준 (개)
                  </label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    min="1"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    이 수량 이하로 떨어지면 재고 부족 경고를 표시합니다.
                  </p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={outOfStockAlert}
                      onChange={(e) => setOutOfStockAlert(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">품절 시 이메일 알림</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoReorder}
                      onChange={(e) => setAutoReorder(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">자동 재발주</span>
                  </label>

                  {autoReorder && (
                    <div className="ml-6 mt-3 space-y-3 p-3 bg-blue-50 border border-blue-200 rounded">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          재발주 시점 (개)
                        </label>
                        <input
                          type="number"
                          value={reorderPoint}
                          onChange={(e) => setReorderPoint(Number(e.target.value))}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min="1"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          재고가 이 수량 이하로 떨어지면 자동으로 발주합니다.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">
                          재발주 수량 (개)
                        </label>
                        <input
                          type="number"
                          value={reorderQuantity}
                          onChange={(e) => setReorderQuantity(Number(e.target.value))}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min="1"
                        />
                      </div>

                      <div className="p-2 bg-white border rounded text-xs">
                        <p className="text-gray-700">
                          재고가 <strong>{reorderPoint}개</strong> 이하로 떨어지면
                          자동으로 <strong>{reorderQuantity}개</strong>를 발주합니다.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    평균 일 판매량 (개)
                  </label>
                  <input
                    type="number"
                    value={averageDailySales}
                    onChange={(e) => setAverageDailySales(Number(e.target.value))}
                    className="w-full border rounded px-3 py-2"
                    min="0"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    예상 품절일 계산에 사용됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 재고 히스토리 */}
            <div className="border-t pt-4">
              <button
                type="button"
                onClick={() => setShowStockHistory(!showStockHistory)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showStockHistory ? '재고 이력 숨기기' : '재고 이력 보기'} ({stockHistory.length}건)
              </button>

              {showStockHistory && (
                <div className="mt-3 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {stockHistory.slice().reverse().map((history, index) => (
                      <div key={index} className="p-2 bg-gray-50 border rounded text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{history.quantity}개</span>
                          <span className="text-xs text-gray-600">
                            {history.date.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {history.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {productType === '옵션형' && useStockManagement && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-medium text-yellow-800 mb-2">옵션형 상품 재고 관리</p>
            <p className="text-sm text-yellow-700">
              옵션형 상품은 재고를 옵션 단위로 관리합니다.
              각 옵션 아이템의 재고를 "가격 정책" 섹션에서 입력해주세요.
            </p>

            {optionGroups.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-yellow-800">옵션별 재고 현황</p>
                {optionGroups.map((group, gIndex) => (
                  <div key={gIndex} className="pl-3">
                    <p className="text-xs font-medium text-gray-700">{group.name || `그룹 ${gIndex + 1}`}</p>
                    {group.options.map((option: any, oIndex: number) => (
                      <div key={oIndex} className="flex justify-between text-xs text-gray-600 ml-3">
                        <span>{option.name || `옵션 ${oIndex + 1}`}</span>
                        <span className={option.stock === 0 ? 'text-red-600 font-medium' : ''}>
                          {option.stock}개
                          {option.stock === 0 && ' (품절)'}
                          {option.stock > 0 && option.stock < 10 && ' (부족)'}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!useStockManagement && (
          <div className="p-4 bg-gray-100 rounded text-center">
            <p className="text-gray-600">
              재고 관리를 사용하지 않습니다. 재고 수량 제한 없이 판매됩니다.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StockSection;
