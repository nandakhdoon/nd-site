import doctorsData from "./doctors.json";

export interface Doctor {
  slug: string;
  name: string;
  role: string;
  exp: string;
  img: string;
  appointmentType: "adults" | "children";
  intro: string;
  focusAreas: string[];
  seoDescription: string;
  bio: string[];
}

export const doctors: Doctor[] = doctorsData as Doctor[];

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.slug === slug);
}
