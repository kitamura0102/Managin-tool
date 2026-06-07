"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FollowUpStatus, NoteCategory, Severity, Visibility } from "@/lib/types";

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(formData: FormData, name: string) {
  const value = readString(formData, name);
  return value.length > 0 ? value : null;
}

function nullableDate(formData: FormData, name: string) {
  const value = readString(formData, name);
  return value.length > 0 ? value : null;
}

async function getUserContext() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createEmployee(formData: FormData) {
  const { supabase, user } = await getUserContext();

  const { data, error } = await supabase
    .from("employees")
    .insert({
      user_id: user.id,
      full_name: readString(formData, "full_name"),
      role: readString(formData, "role"),
      team: readString(formData, "team"),
      start_date: nullableDate(formData, "start_date"),
      status: readString(formData, "status") || "Active",
      notes: nullableString(formData, "notes")
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/employees");
  redirect(`/employees/${data.id}`);
}

export async function createNote(formData: FormData) {
  const { supabase, user } = await getUserContext();
  const employeeId = readString(formData, "employee_id");

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      employee_id: employeeId,
      note_date: readString(formData, "note_date"),
      category: readString(formData, "category") as NoteCategory,
      observation: readString(formData, "observation"),
      expected_behavior: nullableString(formData, "expected_behavior"),
      impact: nullableString(formData, "impact"),
      feedback_given: nullableString(formData, "feedback_given"),
      employee_response: nullableString(formData, "employee_response"),
      next_step: nullableString(formData, "next_step"),
      follow_up_date: nullableDate(formData, "follow_up_date"),
      severity: (readString(formData, "severity") || "Low") as Severity,
      visibility: (readString(formData, "visibility") || "Private note") as Visibility
    })
    .select("id, follow_up_date, next_step")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (data.follow_up_date && data.next_step) {
    const { error: followUpError } = await supabase.from("follow_ups").insert({
      user_id: user.id,
      employee_id: employeeId,
      note_id: data.id,
      follow_up_date: data.follow_up_date,
      next_step: data.next_step,
      status: "Open"
    });

    if (followUpError) {
      throw new Error(followUpError.message);
    }
  }

  revalidatePath("/");
  revalidatePath("/employees");
  revalidatePath("/follow-ups");
  redirect(`/employees/${employeeId}`);
}

export async function createWeeklyReviewWithNotes(formData: FormData) {
  const { supabase, user } = await getUserContext();

  const { error: reviewError } = await supabase.from("weekly_reviews").insert({
    user_id: user.id,
    review_week_start: readString(formData, "review_week_start"),
    review_week_end: readString(formData, "review_week_end"),
    team_impact_notes: nullableString(formData, "team_impact_notes"),
    feedback_given: nullableString(formData, "feedback_given"),
    expectation_acknowledged: nullableString(formData, "expectation_acknowledged"),
    repeated_patterns: nullableString(formData, "repeated_patterns"),
    next_week_priorities: nullableString(formData, "next_week_priorities")
  });

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  const noteCount = Number(readString(formData, "note_count") || "0");

  for (let index = 0; index < noteCount; index += 1) {
    const employeeId = readString(formData, `note_${index}_employee_id`);
    const observation = readString(formData, `note_${index}_observation`);

    if (!employeeId || !observation) {
      continue;
    }

    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        employee_id: employeeId,
        note_date: readString(formData, `note_${index}_note_date`) || readString(formData, "review_week_end"),
        category: (readString(formData, `note_${index}_category`) || "Performance") as NoteCategory,
        observation,
        expected_behavior: nullableString(formData, `note_${index}_expected_behavior`),
        impact: nullableString(formData, `note_${index}_impact`),
        feedback_given: nullableString(formData, `note_${index}_feedback_given`),
        employee_response: nullableString(formData, `note_${index}_employee_response`),
        next_step: nullableString(formData, `note_${index}_next_step`),
        follow_up_date: nullableDate(formData, `note_${index}_follow_up_date`),
        severity: (readString(formData, `note_${index}_severity`) || "Low") as Severity,
        visibility: (readString(formData, `note_${index}_visibility`) || "Private note") as Visibility
      })
      .select("id, follow_up_date, next_step")
      .single();

    if (noteError) {
      throw new Error(noteError.message);
    }

    if (note.follow_up_date && note.next_step) {
      const { error: followUpError } = await supabase.from("follow_ups").insert({
        user_id: user.id,
        employee_id: employeeId,
        note_id: note.id,
        follow_up_date: note.follow_up_date,
        next_step: note.next_step,
        status: "Open"
      });

      if (followUpError) {
        throw new Error(followUpError.message);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/weekly-review");
  revalidatePath("/follow-ups");
  redirect("/weekly-review?saved=1");
}

export async function updateFollowUpStatus(formData: FormData) {
  const { supabase } = await getUserContext();
  const id = readString(formData, "id");
  const status = readString(formData, "status") as FollowUpStatus;

  const { error } = await supabase
    .from("follow_ups")
    .update({
      status,
      completed_at: status === "Done" ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/follow-ups");
}
