'use client';
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="h-16 border-b px-4 flex items-center justify-between bg-white">
      {/* Logo 部分 */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"  // 改为 .svg 后缀
          alt="Logo"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="font-semibold text-xl">DandiAI</span>
      </Link>

      {/* 移除右侧内容,保持空的 div 以维持 justify-between 布局 */}
      <div></div>
    </nav>
  );
} 