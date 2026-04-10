import React, { useState } from 'react';
import { BookOpen, Clock, PlayCircle, Award, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { mockCourses, TIER_INFO } from '@/data/mockCourses';
import { useBabyStore } from '@/store/useBabyStore';

export default function Courses() {
  const { enrollCourse, isCourseEnrolled } = useBabyStore();
  const [payModal, setPayModal] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<string | null>(null);

  const handleEnroll = (courseId: string) => {
    if (isCourseEnrolled(courseId)) return;
    setPayModal(courseId);
  };

  const handleConfirm = () => {
    if (!payModal) return;
    enrollCourse(payModal);
    setSuccessModal(payModal);
    setPayModal(null);
  };

  const enrollingCourse = mockCourses.find(c => c.id === (payModal ?? successModal));

  const tierColors: Record<string, string> = {
    basic: 'border-gray-200 bg-white',
    advanced: 'border-red-200 bg-red-50',
    live: 'border-red-600 bg-red-600',
  };
  const tierTitleColors: Record<string, string> = {
    basic: 'text-gray-900',
    advanced: 'text-gray-900',
    live: 'text-white',
  };
  const tierSubColors: Record<string, string> = {
    basic: 'text-gray-500',
    advanced: 'text-red-700',
    live: 'text-red-200',
  };

  return (
    <div>
      <Header title="Курсы" />

      <div className="px-4 py-5 space-y-6">
        {/* Pricing tiers */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Тарифы</h3>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(TIER_INFO) as [string, typeof TIER_INFO.basic][]).map(([key, info]) => (
              <div key={key} className={`rounded-2xl border-2 p-3 ${tierColors[key]}`}>
                <p className={`text-xs font-bold ${tierTitleColors[key]}`}>{info.label}</p>
                <p className={`text-base font-black mt-1 ${tierTitleColors[key]}`}>
                  {info.price.toLocaleString()} ₸
                </p>
                <div className="mt-2 space-y-1">
                  {info.features.slice(0, 2).map((f, i) => (
                    <p key={i} className={`text-[10px] ${tierSubColors[key]}`}>✓ {f}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses list */}
        <div className="space-y-3">
          {mockCourses.map(course => {
            const enrolled = isCourseEnrolled(course.id);
            const tier = TIER_INFO[course.tier];
            return (
              <div key={course.id} className={`bg-white rounded-2xl border p-4 ${enrolled ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.color}`}>
                        {tier.label}
                      </span>
                      {enrolled && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle size={10} /> Куплено
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug">{course.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{course.description}</p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={11} />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <PlayCircle size={11} />
                        {course.lessons} уроков
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <p className="text-base font-bold text-gray-900">
                    {course.price.toLocaleString()} ₸
                  </p>
                  <Button
                    size="sm"
                    variant={enrolled ? 'secondary' : 'primary'}
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrolled}
                  >
                    {enrolled ? (
                      <span className="flex items-center gap-1"><BookOpen size={12} /> Открыть</span>
                    ) : 'Записаться'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment modal */}
      <Modal isOpen={!!payModal} onClose={() => setPayModal(null)} title="Оплата курса">
        {enrollingCourse && (
          <div className="p-5">
            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
              <p className="text-sm font-semibold text-gray-900">{enrollingCourse.title}</p>
              <p className="text-xs text-gray-500 mt-1">{enrollingCourse.duration} · {enrollingCourse.lessons} уроков</p>
              <p className="text-xl font-black text-red-600 mt-2">{enrollingCourse.price.toLocaleString()} ₸</p>
            </div>

            <div className="space-y-2 mb-5">
              {['Visa •••• 4242', 'Kaspi Gold •••• 8811'].map(card => (
                <div key={card} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-red-400 transition-colors">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                  <span className="text-sm text-gray-700">{card}</span>
                </div>
              ))}
            </div>

            <Button fullWidth size="lg" onClick={handleConfirm}>
              Оплатить {enrollingCourse.price.toLocaleString()} ₸
            </Button>
          </div>
        )}
      </Modal>

      {/* Success modal */}
      <Modal isOpen={!!successModal} onClose={() => setSuccessModal(null)}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Оплата прошла!</h3>
          <p className="text-sm text-gray-500 mb-2">
            Курс <strong>{enrollingCourse?.title}</strong> добавлен в ваш аккаунт
          </p>
          <p className="text-xs text-gray-400 mb-5">Это демо-оплата, реальных транзакций не происходит</p>
          <Button fullWidth onClick={() => setSuccessModal(null)}>Отлично!</Button>
        </div>
      </Modal>
    </div>
  );
}
