'use client';

import { useState, useEffect } from 'react';

interface DisplaySettingSectionProps {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  showWeb: boolean;
  setShowWeb: (value: boolean) => void;
  showMobile: boolean;
  setShowMobile: (value: boolean) => void;
  showExternalMarket: boolean;
  setShowExternalMarket: (value: boolean) => void;
  externalMarketId: string;
  setExternalMarketId: (value: string) => void;
  isMarketConnecting: boolean;
  setIsMarketConnecting: (value: boolean) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  touched: Record<string, boolean>;
  setTouched: (touched: Record<string, boolean>) => void;
}

const DisplaySettingSection = (props: DisplaySettingSectionProps) => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    showWeb,
    setShowWeb,
    showMobile,
    setShowMobile,
    showExternalMarket,
    setShowExternalMarket,
    externalMarketId,
    setExternalMarketId,
    isMarketConnecting,
    setIsMarketConnecting,
    errors,
    setErrors,
    touched,
    setTouched,
  } = props;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [displayDuration, setDisplayDuration] = useState(0);
  const [isAlwaysDisplay, setIsAlwaysDisplay] = useState(false);
  const [marketAccounts, setMarketAccounts] = useState<
    { id: string; name: string; platform: string }[]
  >([]);
  const [selectedMarketAccount, setSelectedMarketAccount] = useState('');
  const [marketSyncEnabled, setMarketSyncEnabled] = useState(false);
  const [marketFee, setMarketFee] = useState(0);
  const [estimatedReach, setEstimatedReach] = useState(0);

  // 노출 기간 계산
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end.getTime() - start.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDisplayDuration(days);
    } else {
      setDisplayDuration(0);
    }
  }, [startDate, endDate]);

  // 예상 도달 수 계산
  useEffect(() => {
    let reach = 0;
    if (showWeb) reach += 10000;
    if (showMobile) reach += 15000;
    if (showExternalMarket && externalMarketId) reach += 20000;
    setEstimatedReach(reach);
  }, [showWeb, showMobile, showExternalMarket, externalMarketId]);

  // 외부 마켓 연동
  const connectExternalMarket = async () => {
    if (externalMarketId) {
      alert('이미 연동된 마켓이 있습니다.');
      return;
    }

    setIsMarketConnecting(true);

    // 가짜 마켓 계정 목록
    const accounts = [
      { id: 'NAVER-001', name: '네이버 스마트스토어', platform: '네이버' },
      { id: 'COUPANG-001', name: '쿠팡 셀러', platform: '쿠팡' },
      { id: 'GMARKET-001', name: 'G마켓 판매자', platform: 'G마켓' },
    ];
    setMarketAccounts(accounts);

    const confirmed = window.confirm(
      '외부 마켓 계정을 선택하세요.\n\n' +
        accounts.map((a, i) => `${i + 1}. ${a.name} (${a.platform})`).join('\n') +
        '\n\n확인: 연동 성공, 취소: 연동 실패'
    );

    if (confirmed) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
      setExternalMarketId(randomAccount.id);
      setSelectedMarketAccount(randomAccount.name);
      setShowExternalMarket(true);
      setMarketFee(
        randomAccount.platform === '쿠팡' ? 10 : randomAccount.platform === '네이버' ? 5 : 7
      );
    } else {
      setShowExternalMarket(false);
    }

    setIsMarketConnecting(false);
  };

  // Validation
  const validateStartDate = (value: string) => {
    const newErrors = { ...errors };

    if (value && new Date(value) < new Date()) {
      newErrors.startDate = '시작일은 현재 시각 이후여야 합니다.';
    } else {
      delete newErrors.startDate;
    }

    if (value && endDate && new Date(value) >= new Date(endDate)) {
      newErrors.startDate = '시작일은 종료일 이전이어야 합니다.';
    }

    setErrors(newErrors);
  };

  const validateEndDate = (value: string) => {
    const newErrors = { ...errors };

    if (startDate && value && new Date(value) <= new Date(startDate)) {
      newErrors.endDate = '종료일은 시작일 이후여야 합니다.';
    } else {
      delete newErrors.endDate;
    }

    setErrors(newErrors);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setTouched({ ...touched, startDate: true });
    validateStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setTouched({ ...touched, endDate: true });
    validateEndDate(value);
  };

  const setQuickDate = (days: number) => {
    const now = new Date();
    const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 내일
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    setStartDate(start.toISOString().slice(0, 16));
    setEndDate(end.toISOString().slice(0, 16));
  };

  return (
    <section className="border p-6 rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">4. 노출 설정</h2>

      <div className="space-y-6">
        {/* 노출 기간 */}
        <div>
          <h3 className="font-medium mb-2">노출 기간</h3>

          <div>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={isAlwaysDisplay}
                onChange={e => setIsAlwaysDisplay(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">상시 노출</span>
            </label>
          </div>

          {!isAlwaysDisplay && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium mb-1">시작 일시</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={e => handleStartDateChange(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {touched.startDate && errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">종료 일시</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={e => handleEndDateChange(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                  {touched.endDate && errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  1주일
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(30)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  1개월
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(90)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  3개월
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(365)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  1년
                </button>
              </div>

              {startDate && endDate && displayDuration > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    노출 기간: <strong>{displayDuration}일</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {new Date(startDate).toLocaleString()} ~ {new Date(endDate).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="mt-2">
                <label className="block text-xs font-medium mb-1">타임존</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="Asia/Seoul">Asia/Seoul (KST, UTC+9)</option>
                  <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                  <option value="Europe/London">Europe/London (GMT, UTC+0)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST, UTC+9)</option>
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  선택한 타임존으로 시간이 저장됩니다. (서버는 UTC 기준)
                </p>
              </div>
            </>
          )}

          {isAlwaysDisplay && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">✓ 이 상품은 기간 제한 없이 상시 노출됩니다.</p>
            </div>
          )}
        </div>

        {/* 노출 채널 */}
        <div>
          <h3 className="font-medium mb-2">노출 채널</h3>
          <p className="text-sm text-gray-600 mb-3">
            상품을 노출할 채널을 선택하세요. 여러 채널을 동시에 선택할 수 있습니다.
          </p>

          <div className="space-y-3">
            <label
              className={`flex items-start p-4 border-2 rounded cursor-pointer transition-all ${
                showWeb ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={showWeb}
                onChange={e => setShowWeb(e.target.checked)}
                className="mt-1 mr-3 w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">웹 (PC)</span>
                  {showWeb && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">활성</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">PC 웹 브라우저에서 상품을 노출합니다.</p>
                {showWeb && <p className="text-xs text-blue-600 mt-2">예상 도달: 일 10,000명</p>}
              </div>
            </label>

            <label
              className={`flex items-start p-4 border-2 rounded cursor-pointer transition-all ${
                showMobile ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={showMobile}
                onChange={e => setShowMobile(e.target.checked)}
                className="mt-1 mr-3 w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">모바일 (앱/웹)</span>
                  {showMobile && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">활성</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  모바일 앱 및 모바일 웹에서 상품을 노출합니다.
                </p>
                {showMobile && <p className="text-xs text-blue-600 mt-2">예상 도달: 일 15,000명</p>}
              </div>
            </label>

            <label
              className={`flex items-start p-4 border-2 rounded cursor-pointer transition-all ${
                showExternalMarket ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } ${isMarketConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="checkbox"
                checked={showExternalMarket}
                onChange={e => {
                  if (e.target.checked && !externalMarketId) {
                    connectExternalMarket();
                  } else {
                    setShowExternalMarket(e.target.checked);
                  }
                }}
                disabled={isMarketConnecting}
                className="mt-1 mr-3 w-4 h-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">외부 마켓</span>
                  {isMarketConnecting && (
                    <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">
                      연동 중...
                    </span>
                  )}
                  {showExternalMarket && externalMarketId && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                      연동됨
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  네이버, 쿠팡 등 외부 마켓에 상품을 노출합니다. 연동 필요.
                </p>
                {showExternalMarket && externalMarketId && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-green-600">✓ 연동 완료: {selectedMarketAccount}</p>
                    <p className="text-xs text-green-600">마켓 ID: {externalMarketId}</p>
                    <p className="text-xs text-blue-600">예상 도달: 일 20,000명</p>
                    <p className="text-xs text-orange-600">수수료: {marketFee}%</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {externalMarketId && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-green-800 text-sm">외부 마켓 연동 정보</p>
                  <p className="text-xs text-green-700 mt-1">마켓: {selectedMarketAccount}</p>
                  <p className="text-xs text-green-700">ID: {externalMarketId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('외부 마켓 연동을 해제하시겠습니까?')) {
                      setExternalMarketId('');
                      setSelectedMarketAccount('');
                      setShowExternalMarket(false);
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  연동 해제
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-green-300">
                <label className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={marketSyncEnabled}
                    onChange={e => setMarketSyncEnabled(e.target.checked)}
                    className="mr-2"
                  />
                  재고/가격 자동 동기화
                </label>
                {marketSyncEnabled && (
                  <p className="text-xs text-gray-600 mt-1 ml-5">
                    상품 정보가 변경되면 연동된 마켓에 자동으로 반영됩니다.
                  </p>
                )}
              </div>
            </div>
          )}

          {!showWeb && !showMobile && !showExternalMarket && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                ⚠ 노출 채널이 선택되지 않았습니다. 최소 1개 이상의 채널을 선택해주세요.
              </p>
            </div>
          )}

          {(showWeb || showMobile || showExternalMarket) && (
            <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded">
              <h4 className="font-medium text-purple-900 mb-2">예상 도달 범위</h4>
              <div className="text-3xl font-bold text-purple-700 mb-2">
                일 {estimatedReach.toLocaleString()}명
              </div>
              <div className="text-sm text-purple-600">
                선택한 채널:{' '}
                {[
                  showWeb && '웹',
                  showMobile && '모바일',
                  showExternalMarket && externalMarketId && '외부마켓',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </div>

              {estimatedReach > 30000 && (
                <div className="mt-2 pt-2 border-t border-purple-300">
                  <p className="text-xs text-purple-700">🎉 높은 노출 효과가 예상됩니다!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplaySettingSection;
