'use client';
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import NextLink from "next/link";
import withAuth from '../hoc/withAuth';
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

function PatientDashboard() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Welcome to the </span>
        <span className={title({ color: "violet" })}>Patient Dashboard</span>
        <br />
        <span className={title()}>
          Manage your appointments and medical history
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Easily view and manage your upcoming appointments and past treatments.
        </div>
      </div>

      <div className="flex gap-3">
        <NextLink
          className="inline-block"
          href="/patient-app-register" 
        >
          <Button auto color="primary" radius="full" variant="shadow">
            Register New Appointment
          </Button>
        </NextLink>
        
        <NextLink
          className="inline-block"
          href="/patient-app-history"
        >
          <Button auto color="secondary" radius="full" variant="bordered">
            View Appointment History
          </Button>
        </NextLink>

      </div>
    </section>
  );
}

export default withAuth(PatientDashboard);