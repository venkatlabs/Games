import { describe, expect, it } from "vitest";
import { bestVoice, pitchFor } from "../src/narrator";

const v = (name: string, lang: string) => ({ name, lang, localService: false, default: false, voiceURI: name }) as SpeechSynthesisVoice;

describe("narrator voice choice", () => {
  const all = [v("Google US English", "en-US"), v("Google UK English Male", "en-GB"), v("Microsoft Neerja Online (Natural) - English (India)", "en-IN"), v("Google हिन्दी", "hi-IN")];
  it("prefers an Indian-English female voice when the device has one", () => {
    expect(bestVoice(all, "en")?.name).toMatch(/Neerja/);
    expect(pitchFor(bestVoice(all, "en"))).toBe(1);
  });
  it("falls back to the earlier UK male voice, at its deep pitch, when there is no Indian voice", () => {
    const rest = all.filter((x) => x.lang !== "en-IN");
    expect(bestVoice(rest, "en")?.name).toBe("Google UK English Male");
    expect(pitchFor(bestVoice(rest, "en"))).toBe(0.5);
  });
  it("picks the language's own voice, and prefers a female one", () => {
    expect(bestVoice(all, "hi")?.name).toBe("Google हिन्दी");
    const ta = [v("Microsoft Valluvar - Tamil", "ta-IN"), v("Microsoft Pallavi - Tamil", "ta-IN")];
    expect(bestVoice(ta, "ta")?.name).toMatch(/Pallavi/);
    expect(bestVoice([], "te")).toBeUndefined();
  });
});
