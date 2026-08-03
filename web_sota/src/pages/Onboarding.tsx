import {
	ArrowLeft,
	ArrowRight,
	Dog,
	HeartPulse,
	PartyPopper,
	Rocket,
	User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../lib/api";

const today = () => new Date().toISOString().slice(0, 10);

type OnboardingStatus = {
	ok: boolean;
	onboarded: boolean;
	mock_data_note: string;
	profile: {
		first_name: string;
		city: string;
		timezone: string;
		pet_name: string;
	};
};

const STEPS = [
	{ key: "you", label: "You", icon: User },
	{ key: "health", label: "Health", icon: HeartPulse },
	{ key: "benny", label: "Your dog", icon: Dog },
	{ key: "done", label: "Done", icon: PartyPopper },
] as const;

export default function Onboarding() {
	const [step, setStep] = useState(0);
	const [profile, setProfile] = useState({
		first_name: "",
		city: "Vienna",
		timezone: "Europe/Vienna",
		pet_name: "",
	});
	const [doctor, setDoctor] = useState({
		doctor: "",
		specialty: "",
		date: today(),
	});
	const [med, setMed] = useState({
		name: "",
		dose: "",
		unit: "",
		frequency: "",
	});
	const [pet, setPet] = useState({
		event_type: "vet",
		next_due: "",
		notes: "",
	});
	const [saving, setSaving] = useState(false);
	const [done, setDone] = useState(false);

	useEffect(() => {
		apiGet<OnboardingStatus>(API.onboarding.status)
			.then((s) => {
				if (s.onboarded) setDone(true);
				if (s.profile?.first_name) setProfile(s.profile);
			})
			.catch(() => {});
	}, []);

	const saveStep = useCallback(async () => {
		setSaving(true);
		try {
			await apiPost(API.onboarding.profile, profile);
			if (doctor.doctor) {
				await apiPost(API.life.visits, {
					date: doctor.date,
					doctor: doctor.doctor,
					specialty: doctor.specialty,
					reason: "First onboarding entry",
				});
			}
			if (med.name) {
				await apiPost(API.life.medications, { ...med, active: true });
			}
			if (profile.pet_name) {
				await apiPost(API.onboarding.pet, {
					pet_name: profile.pet_name,
					event_type: pet.event_type,
					next_due: pet.next_due,
					notes: pet.notes,
				});
			}
			await apiPost(API.onboarding.complete);
			setDone(true);
		} catch {
			setDone(true); // still mark done — data is best-effort
		} finally {
			setSaving(false);
		}
	}, [profile, doctor, med, pet]);

	if (done) {
		return (
			<div
				className="space-y-8 page-enter max-w-2xl mx-auto pt-16"
				data-testid="onboarding-done"
			>
				<div className="text-center space-y-4">
					<PartyPopper className="w-12 h-12 text-cosmos-400 mx-auto" />
					<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
						Welcome{profile.first_name ? `, ${profile.first_name}` : ""}!
					</h1>
					<p className="text-slate-300">
						ViLife is set up. The demo data stays until you replace it — ask the
						Chat to "log a doctor visit" or "add a medication" any time, or use
						the forms on each page.
					</p>
					<a
						href="/"
						className="inline-block px-6 py-3 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 text-white text-xs font-black uppercase tracking-widest"
						data-testid="onboarding-go"
					>
						Go to dashboard
					</a>
				</div>
			</div>
		);
	}

	const StepIcon = STEPS[step].icon;

	return (
		<div
			className="space-y-8 page-enter max-w-2xl mx-auto pt-10"
			data-testid="onboarding-page"
		>
			<div className="text-center space-y-3">
				<Rocket className="w-10 h-10 text-cosmos-400 mx-auto" />
				<h1 className="text-4xl font-black gradient-text tracking-tighter uppercase italic">
					Welcome to ViLife
				</h1>
				<p className="text-slate-300">
					A few details to make it yours — everything is editable later.
				</p>
				<div className="flex justify-center gap-2 pt-2">
					{STEPS.map((s, i) => (
						<div
							key={s.key}
							className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${
								i === step
									? "bg-cosmos-500 text-white border-cosmos-500"
									: "text-slate-300 border-white/[0.08]"
							}`}
						>
							<s.icon className="w-3.5 h-3.5" /> {s.label}
						</div>
					))}
				</div>
			</div>

			<div className="glass-card p-8 space-y-5">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
						<StepIcon className="w-5 h-5 text-cosmos-400" />
					</div>
					<h2 className="text-sm font-black text-white uppercase tracking-widest">
						{STEPS[step].label}
					</h2>
				</div>

				{step === 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input
							data-testid="onb-name"
							placeholder="Your first name"
							value={profile.first_name}
							onChange={(e) =>
								setProfile({ ...profile, first_name: e.target.value })
							}
							className="input-dark"
						/>
						<input
							data-testid="onb-city"
							placeholder="City"
							value={profile.city}
							onChange={(e) => setProfile({ ...profile, city: e.target.value })}
							className="input-dark"
						/>
						<input
							data-testid="onb-pet-name"
							placeholder="Your dog's name (Benny?)"
							value={profile.pet_name}
							onChange={(e) =>
								setProfile({ ...profile, pet_name: e.target.value })
							}
							className="input-dark md:col-span-2"
						/>
					</div>
				)}

				{step === 1 && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<input
							data-testid="onb-doctor"
							placeholder="Your doctor (optional)"
							value={doctor.doctor}
							onChange={(e) => setDoctor({ ...doctor, doctor: e.target.value })}
							className="input-dark md:col-span-2"
						/>
						<input
							data-testid="onb-specialty"
							placeholder="Specialty (Allgemeinmedizin…)"
							value={doctor.specialty}
							onChange={(e) =>
								setDoctor({ ...doctor, specialty: e.target.value })
							}
							className="input-dark"
						/>
						<input
							data-testid="onb-med"
							placeholder="A medication you take (optional)"
							value={med.name}
							onChange={(e) => setMed({ ...med, name: e.target.value })}
							className="input-dark md:col-span-2"
						/>
						<input
							data-testid="onb-med-dose"
							placeholder="Dose (e.g. 2000 IE)"
							value={med.dose}
							onChange={(e) => setMed({ ...med, dose: e.target.value })}
							className="input-dark"
						/>
						<input
							data-testid="onb-med-freq"
							placeholder="Frequency (1x daily)"
							value={med.frequency}
							onChange={(e) => setMed({ ...med, frequency: e.target.value })}
							className="input-dark"
						/>
					</div>
				)}

				{step === 2 && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<select
							data-testid="onb-pet-type"
							value={pet.event_type}
							onChange={(e) => setPet({ ...pet, event_type: e.target.value })}
							className="input-dark"
						>
							<option value="vet">Vet visit</option>
							<option value="vaccination">Vaccination</option>
							<option value="grooming">Grooming</option>
							<option value="walk">Walk</option>
						</select>
						<input
							data-testid="onb-pet-due"
							type="date"
							title="Next due"
							value={pet.next_due}
							onChange={(e) => setPet({ ...pet, next_due: e.target.value })}
							className="input-dark"
						/>
						<input
							data-testid="onb-pet-notes"
							placeholder="Notes"
							value={pet.notes}
							onChange={(e) => setPet({ ...pet, notes: e.target.value })}
							className="input-dark"
						/>
					</div>
				)}

				{step === 3 && (
					<div className="space-y-3 text-sm text-slate-300">
						<p>
							That's everything you need to start. What's next is up to you:
						</p>
						<ul className="list-disc pl-5 space-y-1">
							<li>Chat can log expenses, events, and notes for you.</li>
							<li>
								Health, Travel, Journal, Household pages have their own forms.
							</li>
							<li>
								News, Notes, and Email light up when the fleet servers run.
							</li>
							<li>The demo data is yours to keep or replace.</li>
						</ul>
					</div>
				)}

				<div className="flex justify-between pt-4">
					<button
						type="button"
						onClick={() => setStep((s) => Math.max(0, s - 1))}
						disabled={step === 0 || saving}
						className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 text-xs font-black uppercase tracking-widest"
					>
						<ArrowLeft className="w-3.5 h-3.5" /> Back
					</button>
					{step < 3 ? (
						<button
							type="button"
							onClick={() => setStep((s) => Math.min(3, s + 1))}
							className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cosmos-500 hover:bg-cosmos-600 text-white text-xs font-black uppercase tracking-widest"
							data-testid="onb-next"
						>
							Next <ArrowRight className="w-3.5 h-3.5" />
						</button>
					) : (
						<button
							type="button"
							onClick={saveStep}
							disabled={saving}
							className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-black uppercase tracking-widest"
							data-testid="onb-finish"
						>
							{saving ? "Saving…" : "Finish setup"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
