import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  title: 'Pricing | Quizboard Maker',
  description:
    'Quizboard Maker does not currently publish paid plans or pricing.',
  canonicalUrl: '/pricing',
  noIndex: true,
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isChinese = locale === 'zh';

  return (
    <main className="min-h-screen bg-[#f5f4ed] px-6 py-16 text-[#15231e] md:px-10 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Link className="text-sm font-semibold text-[#347957]" href="/">
          {isChinese ? '返回 Quizboard Maker' : 'Back to Quizboard Maker'}
        </Link>
        <section className="mt-16 rounded-3xl border border-[#dfe5db] bg-white p-8 shadow-[0_22px_55px_rgba(29,43,35,.08)] md:p-12">
          <p className="font-mono text-xs uppercase tracking-[.14em] text-[#638070]">
            {isChinese ? '价格状态' : 'PRICING STATUS'}
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            {isChinese ? '价格暂未公开。' : 'Pricing is not published yet.'}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#68766f]">
            {isChinese
              ? 'Quizboard Maker 当前没有公开的付费方案或价格。你可以直接开始制作和审核题板；这里不会展示来自原模板的计划或价格。'
              : 'Quizboard Maker does not currently publish paid plans or pricing. You can start building and reviewing a board, and this page will not display plans or prices from the underlying template.'}
          </p>
          <a
            className="mt-8 inline-flex rounded-xl bg-[#15231e] px-5 py-3 font-semibold text-white"
            href="mailto:support@quizboardly.xyz"
          >
            {isChinese ? '联系支持邮箱' : 'Contact support'}
          </a>
        </section>
      </div>
    </main>
  );
}
