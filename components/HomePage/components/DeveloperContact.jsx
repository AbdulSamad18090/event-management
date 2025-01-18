"use client";

import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import "aos/dist/aos.css";
import AOS from "aos";
import { useEffect } from "react";

export default function DeveloperContact() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      offset: 100, // Offset from viewport
      easing: "ease-in-out",
    });
  }, []);

  return (
    <Card
      data-aos="zoom-in"
      data-aos-delay={300}
      className="w-full max-w-6xl mx-auto overflow-hidden shadow-2xl bg-gradient-to-br from-background via-background to-primary/5"
    >
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row items-center">
          <div
            className="lg:w-2/5 p-8 flex justify-center items-center"
            data-aos="fade-right"
          >
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-primary shadow-xl">
              <Image
                src="/images/me1.jpg"
                alt="Abdul Samad"
                layout="fill"
                objectFit="cover"
                className="transition-transform object-top duration-300 hover:scale-105"
              />
            </div>
          </div>
          <div
            className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center"
            data-aos="fade-left"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-2 text-primary bg-clip-text ">
              Abdul Samad
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-6">
              Full Stack Developer
            </p>
            <div
              className="bg-secondary/10 p-6 rounded-lg mb-8 border border-secondary/20 shadow-inner"
              data-aos="fade-up"
            >
              <p className="text-muted-foreground leading-relaxed">
                Passionate about crafting elegant solutions to complex problems.
                With a keen eye for detail and a love for clean code, I bring
                ideas to life through innovative web applications. My goal is to
                create seamless user experiences that make a lasting impact.
              </p>
            </div>
            <div className="flex space-x-4 mb-8">
              {[
                {
                  icon: Mail,
                  href: "mailto:abdulsamad18090@gmail.com",
                  label: "Email",
                },
                {
                  icon: Github,
                  href: "https://github.com/AbdulSamad18090",
                  label: "GitHub",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/abdul-samad-7b0069267/",
                  label: "LinkedIn",
                },
              ].map((social, index) => (
                <div
                  key={social.label}
                  data-aos="zoom-in"
                  data-aos-delay={index * 300}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground"
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
            <div data-aos="fade-up">
              <Link
                href={"https://abdulsamad-portfolio.vercel.app/"}
                target="_blank"
              >
                <Button className="w-full lg:w-auto text-lg group ">
                  Get in Touch
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
