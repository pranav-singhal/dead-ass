import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="container flex items-center justify-between gap-10 px-7 py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image
          alt="Image"
          src="/images/dead-ass.png"
          width={250}
          height={800}
        />
      </Link>
    </header>
  );
}
