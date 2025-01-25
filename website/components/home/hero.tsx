import { Button } from '@/components/ui/button';
import { MoveRight, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export const Hero = ({ version }: { version: string }) => (
  <div className="w-full">
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-8 py-16 lg:py-28">
        <div>
          <Button variant="secondary" size="sm" className="gap-4" asChild>
            <Link href={`https://npmjs.org/find-x-ai`}>
              Just released {version} <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-white text-center font-regular text-5xl tracking-tight md:text-7xl">
             <span>Perplexity</span> <span className="gradient-text">But</span> <br />
             For Your Website
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
             Integrate ready made answer engine to your website in minutes
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Button size="lg" className="gap-4 bg-white text-black hover:bg-white/80 hover:text-black" variant="outline" asChild>
            <Link href="/dashboard">
              Get started <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" className="gap-4 border border-[#202020]" asChild>
            <Link href={'/docs/getting_started'}>
              Documentation 
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
