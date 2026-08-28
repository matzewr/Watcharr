import de from "./de.json";
import en from "./en.json";
import type { Language } from "@/types";
import { store } from "@/store.svelte";

const translations: Record<Language, typeof en> = { de, en };

export type TranslationKey =
	| `profile.${keyof typeof en.profile & string}`
	| `profile.rating.${keyof typeof en.profile.rating & string}`
	| `home.${keyof typeof en.home & string}`
	| `nav.${keyof typeof en.nav & string}`
	| `details.${keyof typeof en.details & string}`
	| `common.${keyof typeof en.common & string}`
	| `common.status.${keyof typeof en.common.status & string}`
	| `common.activityMessages.${keyof typeof en.common.activityMessages & string}`
	| `rating.${keyof typeof en.rating & string}`
	| `rating.ratingDescriptions.${keyof typeof en.rating.ratingDescriptions & string}`;

export function t(
	key: TranslationKey,
	params: Record<string, string | number> = {},
): string {
	const language: Language = store.userSettings?.language ?? "en";
	const languageTranslations = translations[language];
	const value = key.split(".").reduce<unknown>(
		(current, part) =>
			current && typeof current === "object"
				? (current as Record<string, unknown>)[part]
				: undefined,
		languageTranslations,
	);
	if (typeof value === "string") {
		return replaceParams(value, params);
	}

	const fallback = key.split(".").reduce<unknown>(
		(current, part) =>
			current && typeof current === "object"
				? (current as Record<string, unknown>)[part]
				: undefined,
		translations.en,
	);
	return typeof fallback === "string" ? replaceParams(fallback, params) : key;
}

function replaceParams(
	value: string,
	params: Record<string, string | number>,
): string {
	return value.replace(/\{(\w+)\}/g, (_, name: string) =>
		String(params[name] ?? `{${name}}`),
	);
}