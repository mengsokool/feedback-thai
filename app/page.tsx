import { Hand } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto max-w-3xl py-16">
        <span className="text-4xl font-semibold">
          <p className="bg-gradient-to-br from-violet-500 to-blue-600 bg-clip-text py-2 leading-tight text-transparent">
            FeedbackThai
          </p>
        </span>
      </div>
      <div className="container mx-auto max-w-3xl space-y-4">
        <p className="text-lg font-medium">เลือกช่องทางการนำเข้าข้อมูล</p>
        <div>
          <Link
            href={"/x"}
            className="border p-4 rounded flex flex-col items-center gap-2 hover:bg-primary/50 hover:border-primary"
          >
            <Image
              alt="X logo"
              className="size-16"
              src={"/twitter-x-icon-logo-116902890413xbfexhf8l.webp"}
              width={850}
              height={847}
            />
            <p>ลิ้งค์โพสต์ X</p>
          </Link>
        </div>
        <div>
          <Link
            href={"/manual"}
            className="border p-4 rounded flex flex-col items-center gap-2 hover:bg-primary/50 hover:border-primary"
          >
            <Hand className="size-16" />
            <p>ป้อนด้วยตนเอง</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
