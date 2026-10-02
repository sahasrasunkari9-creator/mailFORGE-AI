import type { Lang, Purpose, Suggestion, Tone } from "./types";

export interface LangPack {
  code: Lang;
  label: string;
  topicFallback: Record<Purpose, string>;
  companyFallback: string;
  subject: Record<Purpose, string[]>;
  greeting: Record<Tone, { with: string; without: string }>;
  openerTone: Record<Tone, string>;
  opener: Record<Purpose, string[]>;
  core: Record<Purpose, string>;
  cta: Record<Purpose, string>;
  descLead: string;
  support: string;
  detailNote: string;
  bullets: Record<Purpose, string[]>;
  closer: Record<Tone, string>;
  signature: Record<Tone, string>;
  urgency: string;
}

const en: LangPack = {
  code: "en",
  label: "English",
  topicFallback: {
    job: "the role",
    followup: "my previous email",
    proposal: "the proposal",
    meeting: "a short meeting",
    support: "the issue I am facing",
    marketing: "a partnership",
    thanks: "your support",
    custom: "an important topic",
  },
  companyFallback: "your team",
  subject: {
    job: ["Application — {topic}", "Job application: {topic} at {company}", "Candidate for {topic} — {name}"],
    followup: ["Following up: {topic}", "A quick follow-up on {topic}", "Re: {topic} — checking in"],
    proposal: ["Proposal for {company}: {topic}", "A proposal on {topic}", "{topic} — proposal for {company}"],
    meeting: ["Request: a short meeting on {topic}", "Could we find 30 minutes for {topic}?", "Meeting request — {topic}"],
    support: ["Support request: {topic}", "I need help with {topic}", "Issue report — {topic}"],
    marketing: ["Introducing {topic}", "An idea for {company}", "{topic} — a quick introduction"],
    thanks: ["Thank you for {topic}", "My sincere thanks — {topic}", "A note of thanks"],
    custom: ["Regarding {topic}", "Quick note on {topic}", "About {topic}"],
  },
  greeting: {
    professional: { with: "Dear {name},", without: "Dear Team," },
    formal: { with: "Dear {name},", without: "To the concerned team," },
    friendly: { with: "Hi {name},", without: "Hi there," },
    casual: { with: "Hey {name},", without: "Hey team," },
    persuasive: { with: "Hi {name},", without: "Hi there," },
  },
  openerTone: {
    professional: "",
    formal: "I trust this message finds you in good health. ",
    friendly: "Hope you are having a great week! ",
    casual: "Hope all is going well — ",
    persuasive: "I am reaching out because ",
  },
  opener: {
    job: [
      "I am writing to apply for {topic} at {company}.",
      "I would like to express my strong interest in {topic} at {company}.",
    ],
    followup: [
      "I am following up on {topic} to see if there has been any progress.",
      "I wanted to gently follow up on {topic} and check on its status.",
    ],
    proposal: [
      "I am writing to share a proposal regarding {topic}.",
      "I would like to present an idea on {topic} that I believe creates real value for {company}.",
    ],
    meeting: [
      "I would like to request a short meeting to discuss {topic}.",
      "Could we schedule some time to talk through {topic} in detail?",
    ],
    support: [
      "I am writing to report an issue related to {topic} and request your assistance.",
      "I could use some help with {topic} and would appreciate your team's support.",
    ],
    marketing: [
      "I am reaching out to introduce {topic}, which I think is a strong fit for {company}.",
      "I wanted to bring {topic} to your attention, as it aligns closely with what {company} is building.",
    ],
    thanks: [
      "I am writing to express my sincere appreciation for {topic}.",
      "I wanted to take a moment to say thank you for {topic}.",
    ],
    custom: ["I am writing to you regarding {topic}.", "I wanted to reach out about {topic}."],
  },
  core: {
    job: "My background maps closely to the responsibilities of this role, and I am confident I can contribute meaningfully from day one. My experience has sharpened both my execution and my ability to collaborate across teams.",
    followup: "I know your schedule is busy, so I will keep this brief. If anything from my earlier note needs clarification, I am happy to provide additional details right away.",
    proposal: "The idea is simple: a focused, low-risk initiative that can show measurable results quickly, without disrupting what your team is already doing well.",
    meeting: "A focused 30-minute conversation would be enough to align on the key points. I can work around your availability, including evenings if that helps.",
    support: "The issue has been consistent over the past few days, and I have already tried the basic troubleshooting steps. Any guidance from your side would be greatly appreciated.",
    marketing: "What makes this interesting is the timing: your audience is exactly the kind of group that benefits most from what we offer, and the fit feels natural.",
    thanks: "Your effort went a long way in making everything go smoothly, and it genuinely made a difference to me and the team.",
    custom: "I have kept this note short and to the point, and I would welcome the chance to discuss it further whenever it is convenient for you.",
  },
  cta: {
    job: "I would be delighted to discuss how I can contribute to {company} in an interview at your earliest convenience.",
    followup: "Please let me know if you need anything else from my side — I am ready to move forward as soon as you are.",
    proposal: "Would you be open to a 20-minute call this week to walk through the details?",
    meeting: "Could you share two or three slots that work for you? I will make myself available.",
    support: "Could you let me know the next steps so we can resolve this quickly?",
    marketing: "I would love 15 minutes to show you exactly how it works — shall we find a time?",
    thanks: "Please do let me know if there is anything I can do to return the favour.",
    custom: "I look forward to hearing your thoughts on this.",
  },
  descLead: "To give you a little more context — ",
  support: "I have attached the relevant details for your reference, and I am happy to provide anything additional that might help.",
  detailNote: "Here is what I suggest we cover next:",
  bullets: {
    job: [
      "My most relevant experience and the impact I created",
      "Why I am a strong fit for {company} in terms of skills and culture",
      "My availability for an interview at your convenience",
    ],
    followup: [
      "A one-line summary of where things currently stand",
      "What I need from you to move forward",
      "A proposed timeline for the next step",
    ],
    proposal: [
      "The problem and why it matters now",
      "The proposed approach in brief",
      "Expected outcomes and a rough timeline",
    ],
    meeting: [
      "A quick agenda: context, key questions, next steps",
      "The outcomes I would like from the conversation",
      "My proposed time slots",
    ],
    support: [
      "Steps already taken to troubleshoot",
      "When the issue started and how often it occurs",
      "Any error messages or references I can share",
    ],
    marketing: [
      "What we offer and who it is for",
      "Why it fits {company} right now",
      "A simple way to start, with no commitment",
    ],
    thanks: [
      "What specifically made a difference",
      "How it helped the wider team",
      "Looking forward to the next milestone together",
    ],
    custom: [
      "The background in one or two lines",
      "What I am hoping to achieve",
      "A clear next step we can agree on",
    ],
  },
  closer: {
    professional: "I look forward to hearing from you.",
    formal: "I await your kind response at your earliest convenience.",
    friendly: "Hope to hear from you soon!",
    casual: "Let me know what you think!",
    persuasive: "I am confident this is a win for both of us, and I would love to move quickly.",
  },
  signature: {
    professional: "Best regards,",
    formal: "Sincerely,",
    friendly: "Warm regards,",
    casual: "Cheers,",
    persuasive: "Here is to it,",
  },
  urgency: "The timing is right to act on this — I am prepared to move fast and keep the process simple.",
};

const hi: LangPack = {
  code: "hi",
  label: "Hindi",
  topicFallback: {
    job: "is avsar",
    followup: "meri pichli email",
    proposal: "yeh proposal",
    meeting: "ek chhoti meeting",
    support: "us masle",
    marketing: "yeh samajhdari",
    thanks: "aapki madad",
    custom: "ek khaas baat",
  },
  companyFallback: "aapke team",
  subject: {
    job: ["Ardhā — {topic}", "{company} ke liye ardhā: {topic}", "Pad se anurodh — {topic}"],
    followup: ["{topic} — ek follow-up", "Follow-up: {topic}", "{topic} ke baare mein baat karni thi"],
    proposal: ["{company} ke liye proposal — {topic}", "Proposal: {topic}", "{topic} par ek soch"],
    meeting: ["Meeting ka anurodh — {topic}", "{topic} par 30 minute mil sakte hain?", "{topic} — chhoti si meeting"],
    support: ["Support ka anurodh: {topic}", "{topic} mein madad chahiye", "Masla: {topic}"],
    marketing: ["{topic} — parichay", "{company} ke liye ek khabar", "{topic} par baat karna chahta hoon"],
    thanks: ["{topic} ke liye dhanyavaad", "Dhanyavaad — {topic}", "Ek dhanyavaad ka sandes"],
    custom: ["{topic} ke baare mein", "Ek chhoti baat — {topic}", "{topic} — thodi jaankari"],
  },
  greeting: {
    professional: { with: "Namaste {name} ji,", without: "Namaste," },
    formal: { with: "Pranam, {name} ji.", without: "Pranam." },
    friendly: { with: "Namaste {name},", without: "Namaste aapko," },
    casual: { with: "Hi {name},", without: "Hi," },
    persuasive: { with: "Namaste {name} ji,", without: "Namaste," },
  },
  openerTone: {
    professional: "",
    formal: "Mujhe umeed hai aap swasth honge. ",
    friendly: "Umeed hai aapka hafta acha chal raha hai! ",
    casual: "Umeed hai sab theek hai — ",
    persuasive: "Main aapse baat karne ke liye likh raha hoon, kyunki ",
  },
  opener: {
    job: [
      "Main {company} mein {topic} ke liye apni ardhā bhej raha hoon.",
      "Main {company} ke liye {topic} mein gehari ruchi jehta hoon.",
    ],
    followup: [
      "Main {topic} ko lekar ek follow-up bhej raha hoon.",
      "Main {topic} ki sthiti jaanna chahta hoon, isliye ye chhota sa follow-up bhej raha hoon.",
    ],
    proposal: [
      "Main {topic} se sambandhit ek proposal share karna chahta hoon.",
      "Main {topic} par ek idea pesh karna chahta hoon jo {company} ke liye kaam kar sakta hai.",
    ],
    meeting: [
      "Main {topic} ke baare mein baat karne ke liye ek chhoti meeting maangna chahta hoon.",
      "Kya hum {topic} par koi samay nikaal sakte hain?",
    ],
    support: [
      "Main {topic} se juda ek masla report karna chahta hoon.",
      "Mujhe {topic} mein thodi madad chahiye, aapke team ki.",
    ],
    marketing: [
      "Main {topic} ka parichay karne ke liye likh raha hoon, jo {company} ke liye theek ho sakta hai.",
      "Main {topic} aapke dhyan mein laana chahta hoon.",
    ],
    thanks: [
      "Main {topic} ke liye apna dhanyavaad jehta hoon.",
      "Main {topic} ke liye dhanyavaad kehne ke liye thodi der nikalna chahta hoon.",
    ],
    custom: [
      "Main {topic} ke baare mein aapse baat karne ke liye likh raha hoon.",
      "Main {topic} ke baare mein baat karna chahta hoon.",
    ],
  },
  core: {
    job: "Mera anubhav is pad ke karyavah par ache taur par milta hai, aur main pehle din se hi achha yogdan de sakta hoon. Mene apne kaam se execution aur teamwork dono ko behtar banaya hai.",
    followup: "Mujhe pata hai aapka samay ki kimat hai, isliye main ise chhota rakhta hoon. Agar pichli email se kuch aur chahiye, toh main turant details de sakta hoon.",
    proposal: "Soch simple hai: ek focused aur kam risk wala abhiyan jo jaldi measurable results dikhaye, bina aapke team ke abhi chal rahe kaam ko roka.",
    meeting: "Ek 30 minute ki focused baat kaafi hai. Main aapke samay ke hisaab se available rah sakta hoon, shaam bhi.",
    support: "Ye masla pichle kuch dino se consistent hai, aur maine basic troubleshooting pehle hi kar li hai. Aapki taraf se koi bhi guidance bahut kaam aayegi.",
    marketing: "Ise interesting banane wali baat timing hai: aapki audience bilkul wahi hai jo isse sabse zyada fayda uthayegi, aur yeh fit natural lagti hai.",
    thanks: "Aapki mehnat ne sab kuch smooth banane mein bada hissa nibhaya, aur ye mujhe aur team dono ke liye sach mein farak laya.",
    custom: "Maine ye sandes chhota aur seedha rakha hai, aur jab bhi aapko suvidha ho ispar baat karne ke liye main maujood hoon.",
  },
  cta: {
    job: "Main interview ke liye aapki suvidha se {company} ke baare mein baat karne ke liye khush hoon.",
    followup: "Agar mere side se kuch aur chahiye ho toh batayein — jaise hi aap taiyaar honge, main aage badhne ke liye taiyaar hoon.",
    proposal: "Kya aap is hafte 20 minute ki call ke liye khule honge jisme hum details discuss karein?",
    meeting: "Kya aap aise 2-3 slots bata sakte hain jo aapke liye kaam karein? Main available ho jaunga.",
    support: "Kya aap agle steps bata sakte hain taaki hum ise jaldi solve kar saken?",
    marketing: "Mujhe 15 minute mil jayein toh main aapko dikhata hoon ki yeh kaise kaam karta hai — kya hum koi samay nikaalein?",
    thanks: "Agar kuch bhi ho toh batayein ki main kaise wapas madad kar sakta hoon.",
    custom: "Main aapki raay ka intezaar karunga.",
  },
  descLead: "Thodi aur jaankari dene ke liye — ",
  support: "Maine relevant details attach kar di hain, aur kuch aur chahiye ho toh main de sakta hoon.",
  detailNote: "Agla step aise ho sakta hai:",
  bullets: {
    job: [
      "Mera sabse relevant anubhav aur uska asar",
      "Main {company} ke liye kyun strong fit hoon",
      "Interview ke liye meri availability",
    ],
    followup: [
      "Sthiti ki ek line mein summary",
      "Aage badhne ke liye mujhe aapse kya chahiye",
      "Agli step ka proposed timeline",
    ],
    proposal: [
      "Masla aur abhi kyun zaroori hai",
      "Proposed approach short mein",
      "Expected outcomes aur rough timeline",
    ],
    meeting: [
      "Quick agenda: context, sawaal, agle steps",
      "Baat se jo outcomes chahiye",
      "Mere proposed time slots",
    ],
    support: [
      "Troubleshoot karne ke pichhle steps",
      "Masla kab shuru hua aur kitni baar hota hai",
      "Share karne ke liye koi error ya reference",
    ],
    marketing: [
      "Hum kya offer karte hain aur kisko ke liye",
      "Yeh {company} ke liye abhi kyun fit hai",
      "Bina commitment ke shuru karne ka simple tarika",
    ],
    thanks: [
      "Kya specifically farak laya",
      "Yeh poore team ko kaise help kiya",
      "Aane wala milestone ek saath dekhne ka intezaar",
    ],
    custom: ["Context do line mein", "Main kya achieve karna chahta hoon", "Ek clear agla step"],
  },
  closer: {
    professional: "Main aapke jaawab ka intezaar karunga.",
    formal: "Main aapke jaawab ka intezaar kar raha hoon, aapki suvidha se.",
    friendly: "Jald hi aapke jaawab ki umeed hai!",
    casual: "Apni raay zaroor batana!",
    persuasive: "Mujhe bharosa hai ki ye dono ke liye achha rahega, aur main jaldi aage badhna chahta hoon.",
  },
  signature: {
    professional: "Best regards,",
    formal: "Shubh kamana,",
    friendly: "Garam shubhakamnayein,",
    casual: "Cheers,",
    persuasive: "Ise aage badhane ke saath,",
  },
  urgency: "Is par abhi kaam karne ka sahi samay hai — main jaldi aage badhne ke liye taiyaar hoon aur process ko simple rakhunga.",
};

const te: LangPack = {
  code: "te",
  label: "Telugu",
  topicFallback: {
    job: "indi avasarame",
    followup: "naa previous email",
    proposal: "indi proposal",
    meeting: "okkati short meeting",
    support: "naa problem",
    marketing: "okkati partnership",
    thanks: "mee support",
    custom: "oka important matter",
  },
  companyFallback: "mee team",
  subject: {
    job: ["Application — {topic}", "{company} ki application: {topic}", "Position ki application — {topic}"],
    followup: ["{topic} — ekka follow-up", "Follow-up: {topic}", "{topic} varaku chinna follow-up"],
    proposal: ["{company} ki proposal — {topic}", "Proposal: {topic}", "{topic} parvama ekka thotu"],
    meeting: ["Meeting ke liyi anukampamu — {topic}", "{topic} ki 30 minuts nerchukookuntundammara?", "{topic} — chinna meeting"],
    support: ["Support ke liyi anukampu: {topic}", "{topic} lo help chaddevi", "Problem: {topic}"],
    marketing: ["{topic} — introduction", "{company} ki okka idea", "{topic} varaku vachchadam chaddivu"],
    thanks: ["{topic} ki thanks", "Thank you — {topic}", "Okka thanks message"],
    custom: ["{topic} varaku", "Okka chinna vachanam — {topic}", "{topic} — thoda info"],
  },
  greeting: {
    professional: { with: "Vanakkam {name} garu,", without: "Vanakkam," },
    formal: { with: "Namaskaram, {name} garu.", without: "Namaskaram." },
    friendly: { with: "Hello {name},", without: "Vanakkam," },
    casual: { with: "Hi {name},", without: "Hi," },
    persuasive: { with: "Vanakkam {name} garu,", without: "Vanakkam," },
  },
  openerTone: {
    professional: "",
    formal: "Na message mee chala yenti unnaaru anukuntunna. ",
    friendly: "Mee week alane untundo anukuntunna! ",
    casual: "Sari cheyulu alagunda anukuntunna — ",
    persuasive: "Mee chala vachadam ki vachchadanu, karaniki ",
  },
  opener: {
    job: [
      "Na {company} lo {topic} ki application pettanu.",
      "Na {company} ki {topic} lo strong interest unti.",
    ],
    followup: [
      "Na {topic} varaku follow-up vachchadanu.",
      "Na {topic} ki status velchukondam ki chinna follow-up vachchadanu.",
    ],
    proposal: [
      "Na {topic} varaku ekka proposal share cheyyadanu.",
      "Na {topic} parvama ekka idea vasthanu, adi {company} ki kaamaga poyeyi.",
    ],
    meeting: [
      "Na {topic} varaku chinna meeting vasthanu.",
      "Vallu {topic} ki time nerchukovvadam?",
    ],
    support: [
      "Na {topic} lo okka problem undi, adhi vishayama report chesanu.",
      "Na {topic} lo kavalu help chaddevi, mee team nundi.",
    ],
    marketing: [
      "Na {topic} introduction vachchadanu, adi {company} ki fit ayyeyi.",
      "Na {topic} mee attention ki vasthanu.",
    ],
    thanks: [
      "Na {topic} ki sincere thank you pettaanu.",
      "Na {topic} ki thanks vachchadam ki oka minute nerchukovvadanu.",
    ],
    custom: ["Na {topic} varaku mee chala vachchadanu.", "Na {topic} varaku vachchadam chaddivu."],
  },
  core: {
    job: "Na experience eede position duties ki chala fit ayyeyi, ee nunchi first day nunche strong contribution istapinavachu. Na kaam nunche execution oka teamwork meeda improve ayyinadi.",
    followup: "Mee time valuable anukuntunna, ee nunchi ee chinna vasthunna. Previous email nundi entani chinthala chadde eee, na apanaka detail istappinavachu.",
    proposal: "Thotu simple: ekka focused, low risk project, eee quick ga measurable results istapinadi, mee team current work nu disturb cheyakaga.",
    meeting: "30 minutes ki focused vachanam kaafi. Mee availability ki valla available unnavachu, raatri ga weekend ga.",
    support: "Ee problem past few days nunche consistent ga undi, naa basic troubleshooting chesinavv. Mee nundi evadiga guidance chala kaamaga poyeyi.",
    marketing: "Ekinchindi interesting ga cheppina timing: mee audience eeki sab cheyali benefit istavadi, ee fit natural ga undi.",
    thanks: "Mee effort sari cheyulu smooth ga avvakam ki chala help ayyeyi, ee nunche na ki team ki chinna farak chesanu.",
    custom: "Na ee message chinna ga oka direct ga raddinanu, mee suvidha valla ekinchindi discuss cheyyadanu.",
  },
  cta: {
    job: "Interview ki mee suvidha valla {company} lo contribution varaku vachchadam ki khushi undi.",
    followup: "Na nundi entani chinthala chadde battharu — vallu ready ayyaka na ready unnavachchu.",
    proposal: "Vallu eede week ki 20 minute call ki open unnaaraga, details discuss cheyyadanu?",
    meeting: "Mee ki kaamaga poyna 2-3 slots battharaga? Naan available unnavachchu.",
    support: "Vallu next steps battharaga, ee quick ga resolve ayye?",
    marketing: "15 minutes tesaanu, ekkada work ayyeyi istappinavachchu — oka time nerchukovvadam?",
    thanks: "Naan evadiga return ga help chestaani ane vallu battharu.",
    custom: "Eeki mee opinion anukuntunna.",
  },
  descLead: "Thoda extra detail vachadam ki — ",
  support: "Relevant details attach cheyinanu, entani chinthala chadde eee istappinavachchu.",
  detailNote: "Next step ekkada unnavachu:",
  bullets: {
    job: [
      "Na oru relevant experience oka impact",
      "Naan {company} ki strong fit gani ani kaaranam",
      "Interview ki availability",
    ],
    followup: [
      "Current status ki one-line summary",
      "Move forward ki nenu mee nundi chadde chinthala",
      "Next step ki proposed timeline",
    ],
    proposal: [
      "Problem oka ekkada important ga undi",
      "Proposed approach brief ga",
      "Expected outcomes oka rough timeline",
    ],
    meeting: [
      "Quick agenda: context, questions, next steps",
      "Vachanamu nunche chadde outcomes",
      "Na proposed time slots",
    ],
    support: [
      "Troubleshoot ki meeda chesina steps",
      "Problem eppudu start ayyeyi oka ekkada ga vastundi",
      "Share cheyyagalante error oka reference",
    ],
    marketing: [
      "Naan emi offer chestaanu oka kante ki",
      "Eee {company} ki ekkada fit ayyeyi",
      "Commitment undaga start cheyyagalante oka simple way",
    ],
    thanks: [
      "Emi specifically farak chesteyi",
      "Eee full team ki ekkada help ayyeyi",
      "Next milestone ki intejam",
    ],
    custom: ["Context two lines lo", "Naan emi achieve cheyyadanu", "Oka clear next step"],
  },
  closer: {
    professional: "Mee reply anukuntunna.",
    formal: "Mee reply ki mee suvidha valla intejam unnavachchu.",
    friendly: "Vallu quick ga reply chestaru anukuntunna!",
    casual: "Vallu thoughts battharu!",
    persuasive: "Naan confident unnavanu ee raddaru ki chala kaamaga poyeyi, naan quick ga move chestaanu.",
  },
  signature: {
    professional: "Best regards,",
    formal: "Subhakamanalu lo,",
    friendly: "Warm regards,",
    casual: "Cheers,",
    persuasive: "Move forward ki,",
  },
  urgency: "Ee valla ab action tesarpu chala time — naan quick ga move cheyyagalante ready unnavachu, process nu simple ga raddunavachchu.",
};

const ta: LangPack = {
  code: "ta",
  label: "Tamil",
  topicFallback: {
    job: "indi opportunity",
    followup: "naan paaka email",
    proposal: "indi proposal",
    meeting: "kottu meeting-u",
    support: "naan face panna problem",
    marketing: "kattuppayal",
    thanks: "ungal support",
    custom: "vazhva matter",
  },
  companyFallback: "ungal team",
  subject: {
    job: ["Application — {topic}", "{company} kitta application: {topic}", "Position vazi — {topic}"],
    followup: ["{topic} — follow-up", "Follow-up: {topic}", "{topic} vechi small follow-up"],
    proposal: ["{company} kitta proposal — {topic}", "Proposal: {topic}", "{topic} vechi thodhu vidi"],
    meeting: ["Meeting kitta paravacham — {topic}", "{topic} vechi 30 min nalla irungalaa?", "{topic} — kottu meeting"],
    support: ["Support kitta paravacham: {topic}", "{topic} la help venum", "Problem: {topic}"],
    marketing: ["{topic} — introduction", "{company} kitta okka idea", "{topic} vechi paathu paathu"],
    thanks: ["{topic} kitta nazhakkam", "Thank you — {topic}", "Okka thanks message"],
    custom: ["{topic} vechi", "Kottu message — {topic}", "{topic} — thodhu info"],
  },
  greeting: {
    professional: { with: "Vanakkam {name} sir/madam,", without: "Vanakkam," },
    formal: { with: "Vanakkam, {name} sir/madam.", without: "Vanakkam." },
    friendly: { with: "Vanakkam {name},", without: "Vanakkam," },
    casual: { with: "Hi {name},", without: "Hi," },
    persuasive: { with: "Vanakkam {name} sir/madam,", without: "Vanakkam," },
  },
  openerTone: {
    professional: "",
    formal: "Idhu paatha vellarum well unraangala anubandhangkiten. ",
    friendly: "Ungal week nalla irukku anubandhangkiten! ",
    casual: "Oru thadavaalum nalla irukkum — ",
    persuasive: "Unakku ennaku vazhva vishayam vechi vaazhgaam — ",
  },
  opener: {
    job: ["Naan {company} la {topic} kitta application paathuren.", "Naan {company} la {topic} la strong interest irukku."],
    followup: ["Naan {topic} vechi follow-up paathuren.", "Naan {topic} status vishayama kottu follow-up paathuren."],
    proposal: [
      "Naan {topic} vechi okka proposal share panna vishayampopen.",
      "Naan {topic} vechi okka idea vaaiven, adhu {company} kitta kaamathu.",
    ],
    meeting: [
      "Naan {topic} vechi paathu kotta meeting vaaiven.",
      "Unanga {topic} vechi time ellam aagiralaa?",
    ],
    support: [
      "Naan {topic} vechi okka problem face pannen, adha vishayama report pannen.",
      "Naan {topic} la thodhu help venum, ungal team ninda.",
    ],
    marketing: [
      "Naan {topic} introduction panna vishayampopen, adhu {company} kitta fit aagum.",
      "Naan {topic} ungal attention la vaaiven.",
    ],
    thanks: [
      "Naan {topic} kitta sincere nazhakkam sondaipopen.",
      "Naan {topic} kitta naazhakkam vaaicha okka minute ellam.",
    ],
    custom: ["Naan {topic} vechi unanga vaazhgaam.", "Naan {topic} vechi paathu paathu vishayampopen."],
  },
  core: {
    job: "En experience adhu position duties ku nalla fit aagum, first day ninnale strong contribution pannalaam. En kaam la execution um teamwork um improve aayidhuku.",
    followup: "Ungal time valuable anubandhangkiten, edhukku idhu kottu paathuren. Paaka vishayama ellame venum ellame, naan direct ga details vaangalaam.",
    proposal: "Thodhu simple: okka focused, low risk project, adhu quick ga measurable results vaangum, ungal team current work aaga disturb aagama.",
    meeting: "30 minutes ki focused paathu kaafi. Ungal availability la available irungalum, raathiri weekend um.",
    support: "Adhu problem past few days ninnale consistent aagum, naan basic troubleshooting chethen. Ungal ninda oru guidance nalla kaamathu.",
    marketing: "Enna interesting aagum neetiyam: ungal audience adhu la oru varai benefit paavum, adhu fit natural aagum.",
    thanks: "Ungal effort sari vishayama smooth aagum la nalla help aayidhu, adhu nannum team um la vazhva farak aayidhu.",
    custom: "Naan idhu kottu um direct um paathuren, ungal suvidhila oru vishayam discuss panna vishayampopen.",
  },
  cta: {
    job: "Interview la ungal suvidhil {company} la contribution vachchu vachcha ellam.",
    followup: "En ninda oru vishayam venum ellam sollungalaa — ungal ready aagra nalla ready iruken.",
    proposal: "Unanga eppo week la 20 minute call la open aagiralaa, details discuss panna?",
    meeting: "Ungal kaamathu 2-3 slots sollungalaa? Naan available aagalaam.",
    support: "Ungal next steps sollungalaa, adhu quick ga resolve aagala?",
    marketing: "15 minutes koodalaam, adhu eppadi work aagum dhaan paatringaalaam — oru time ellam?",
    thanks: "Naan eppadi return ga help pannalaam enna ungal sollungalaa.",
    custom: "Adhu vishayama ungal opinion anubandhangkiten.",
  },
  descLead: "Thodhu extra detail vachchadam ku — ",
  support: "Relevant details attach pannan, oru vishayam venum ellame vaangalaam.",
  detailNote: "Next step eppadi aagum:",
  bullets: {
    job: [
      "En oru relevant experience um impact um",
      "Naan {company} ku strong fit enna kaaranam",
      "Interview ku availability",
    ],
    followup: [
      "Current status ku one-line summary",
      "Move forward ku enakku ungal ninda venum",
      "Next step ku proposed timeline",
    ],
    proposal: [
      "Problem um eppo important enna um",
      "Proposed approach brief la",
      "Expected outcomes um rough timeline um",
    ],
    meeting: [
      "Quick agenda: context, questions, next steps",
      "Paathula venum outcomes",
      "Na proposed time slots",
    ],
    support: [
      "Troubleshoot ku chetha steps",
      "Problem eppadi start aayidhu um eppadi vasthudhu um",
      "Share panna error um reference um",
    ],
    marketing: [
      "Naan enna offer pannan um enna kudu um",
      "Adhu {company} ku eppo fit aagum",
      "Commitment la start panna oru simple way",
    ],
    thanks: [
      "Enna specifically farak aayidhu",
      "Adhu full team ku eppadi help aayidhu",
      "Next milestone ku intejam",
    ],
    custom: ["Context oru lines la", "Naan enna achieve panna vishayampopen", "Oru clear next step"],
  },
  closer: {
    professional: "Ungal reply anubandhangkiten.",
    formal: "Ungal reply vachchu vachchu, ungal suvidhil.",
    friendly: "Unanga quick ga reply varum anubandhangkiten!",
    casual: "Ungal thoughts sollungalaa!",
    persuasive: "Naan confident aaguren adhu raddhumukku nalla kaamathu, naan quick ga move panna.",
  },
  signature: {
    professional: "Best regards,",
    formal: "Subhakamanagaloda,",
    friendly: "Warm regards,",
    casual: "Cheers,",
    persuasive: "Move forward ku,",
  },
  urgency: "Eppoli action vachchu vachchi eppo right time — naan quick ga move panna ready aaguren, process ku simple aaga rakkalaam.",
};

export const LANGUAGES: Record<Lang, LangPack> = { en, hi, te, ta };

/* ------------------------------------------------------------------ */
/*  AI suggestion inserts (localized)                                  */
/* ------------------------------------------------------------------ */

export const SUGGESTIONS: Record<Purpose, Suggestion[]> = {
  job: [
    {
      id: "job-1",
      label: "Highlight an achievement",
      text: {
        en: "In my most recent role, I led a project that improved key outcomes by 25%, and I would love to bring that same impact to {company}.",
        hi: "Mere pichli job maine ek project lead kiya jo key outcomes ko 25% behtar kiya, aur main wahi impact {company} mein laana chahta hoon.",
        te: "Na previous job lo naan ek project lead ayyanu, adhi key outcomes nu 25% improve ayyindi, adhi impact {company} ki istappinavachchu.",
        ta: "En previous role la naan okka project lead aayen, adhu key outcomes nu 25% improve aayidhu, adhu impact {company} la vaangalaam.",
      },
    },
    {
      id: "job-2",
      label: "Mention availability",
      text: {
        en: "I am available for a call at your convenience this week.",
        hi: "Is hafte aapki suvidha se call ke liye main available hoon.",
        te: "Eede week lo mee suvidha valla call ki naan available unnavachchu.",
        ta: "Eppo week la ungal suvidhil call ku naan available iruken.",
      },
    },
    {
      id: "job-3",
      label: "Add a resume note",
      text: {
        en: "My resume and a short portfolio are attached for your reference.",
        hi: "Meri resume aur ek chhota portfolio aapke reference ke liye attached hai.",
        te: "Na resume oka short portfolio mee reference ki attach ayyindi.",
        ta: "En resume um short portfolio um ungal reference ku attach aayidhu.",
      },
    },
  ],
  followup: [
    {
      id: "fu-1",
      label: "Add a clear timeline",
      text: {
        en: "I would appreciate a brief update by the end of this week.",
        hi: "Is hafte ke ant tak ek chhota sa update aapka anuman hoga.",
        te: "Eede week muddi oka brief update chadde vachchadam nalla.",
        ta: "Eppo week mudinalla oru brief update vachcham nalla.",
      },
    },
    {
      id: "fu-2",
      label: "Offer flexibility",
      text: {
        en: "If now is not a good time, I am happy to reschedule for next week.",
        hi: "Agar abhi sahi time na ho, toh main next week reschedule karne ke liye khush hoon.",
        te: "Eppudu right time lekka ekkada, naan next week ki reschedule cheyyagalante happy unnavachchu.",
        ta: "Eppudu right time la irnala, naan next week ku reschedule panna ready aaguren.",
      },
    },
    {
      id: "fu-3",
      label: "Add a direct number",
      text: {
        en: "You can also reach me directly at +91 98765 43210.",
        hi: "Aap +91 98765 43210 par seedha bhi sampark kar sakte hain.",
        te: "Mee direct ga +91 98765 43210 ninda naa vachchagalaa.",
        ta: "Ungal direct ga +91 98765 43210 la vachchugalam.",
      },
    },
  ],
  proposal: [
    {
      id: "pr-1",
      label: "Quantify the benefit",
      text: {
        en: "Based on similar engagements, this approach typically delivers about a 30% lift in efficiency.",
        hi: "Saman projects ke hisaab se, yeh approach aam taur par efficiency mein 30% tak ka uplift deta hai.",
        te: "Similar projects valla, ee approach generally efficiency lo 30% vargama lift istapinadi.",
        ta: "Similar projects valla, adhu approach generally efficiency la 30% varama lift vaangum.",
      },
    },
    {
      id: "pr-2",
      label: "Suggest a next step",
      text: {
        en: "I can share a one-page summary within 48 hours if that would be useful.",
        hi: "Agar useful lage toh main 48 ghante mein ek one-page summary share kar sakta hoon.",
        te: "Ee useful ayye ekkada, naan 48 hours lo oka one-page summary share cheyyagalaa.",
        ta: "Adhu useful aaga, naan 48 hours la oru one-page summary share panna mudiyum.",
      },
    },
    {
      id: "pr-3",
      label: "Add a timeline",
      text: {
        en: "We could begin within two weeks of confirmation.",
        hi: "Confirmation ke baad main do hafte ke andar shuru kar sakta hoon.",
        te: "Confirmation nunchi two weeks lo naan start cheyyagalaa.",
        ta: "Confirmation ninnula two weeks la naan start panna mudiyum.",
      },
    },
  ],
  meeting: [
    {
      id: "me-1",
      label: "Suggest two time slots",
      text: {
        en: "I am free Tuesday at 11 am or Thursday at 4 pm — whichever works for you.",
        hi: "Main Tuesday 11 baje ya Thursday 4 baje free hoon — jo aapke liye kaam kare.",
        te: "Naan Tuesday 11 am va Thursday 4 pm la free unnavachchu — mee ki kaamaga poyna.",
        ta: "Naan Tuesday 11 am um Thursday 4 pm um la free iruken — ungal ku kaamathu.",
      },
    },
    {
      id: "me-2",
      label: "Keep it short",
      text: {
        en: "Fifteen minutes should be enough; I will keep it focused.",
        hi: "Pahanch minit kaafi honge; main ise focused rakhunga.",
        te: "15 minutes kaafi — naan ee focused ga raddunavachchu.",
        ta: "15 minutes kaafi — naan adhu focused aaga rakkalaam.",
      },
    },
    {
      id: "me-3",
      label: "Add an agenda",
      text: {
        en: "Agenda: a quick update, open questions, and next steps.",
        hi: "Agenda: ek quick update, open questions, aur agle steps.",
        te: "Agenda: quick update, open questions, next steps.",
        ta: "Agenda: quick update, open questions, next steps.",
      },
    },
  ],
  support: [
    {
      id: "su-1",
      label: "Include error details",
      text: {
        en: "Error reference: MF-4021, occurring intermittently since this morning.",
        hi: "Error reference: MF-4021, is subah se be-samay aa raha hai.",
        te: "Error reference: MF-4021, eepula nunche intermittent ga vastundi.",
        ta: "Error reference: MF-4021, eppula ninnula intermittent aagum.",
      },
    },
    {
      id: "su-2",
      label: "State the impact",
      text: {
        en: "This is currently blocking our team from completing daily tasks.",
        hi: "Filhal isse hamari team daily tasks poori karne mein ruk gayi hai.",
        te: "Eega current ga mee team daily tasks complete cheyaga block ayyindi.",
        ta: "Edhula current ga ungal team daily tasks complete panna block aagum.",
      },
    },
    {
      id: "su-3",
      label: "Ask for a timeline",
      text: {
        en: "Could you share an estimated resolution time?",
        hi: "Kya aap ek estimated resolution time share kar sakte hain?",
        te: "Vallu oka estimated resolution time share cheyyagalaa?",
        ta: "Ungal oru estimated resolution time share pannaagiralaa?",
      },
    },
  ],
  marketing: [
    {
      id: "ma-1",
      label: "Add a social proof line",
      text: {
        en: "Teams like yours have seen results within the first month.",
        hi: "Aapki jaisi teams ne pehle mahine mein hi results dekhe hain.",
        te: "Mee jasti teams first month lo medama results chudanay.",
        ta: "Ungal jasti teams first month lae results paa irukku.",
      },
    },
    {
      id: "ma-2",
      label: "Add a soft CTA",
      text: {
        en: "A 15-minute intro call is all it takes — I bring the ideas, you bring the questions.",
        hi: "Sirf 15 minute ki intro call chahiye — main ideas laata hoon, aap sawaal.",
        te: "15 minutes ki intro call mattum — naan ideas istappinavachchu, vallu questions.",
        ta: "15 minutes ku intro call mattum — naan ideas vaanguren, ungal questions.",
      },
    },
    {
      id: "ma-3",
      label: "Mention personalization",
      text: {
        en: "I would love to tailor this specifically for {company}'s current goals.",
        hi: "Main ise {company} ke current goals ke hisaab se specifically tailor karna chahta hoon.",
        te: "Nan ee {company} current goals valla specifically tailor cheyyadanu.",
        ta: "Nan adhu {company} current goals valla specifically tailor panna vishayampopen.",
      },
    },
  ],
  thanks: [
    {
      id: "th-1",
      label: "Offer ongoing help",
      text: {
        en: "Please do not hesitate to reach out whenever you need me.",
        hi: "Jab bhi aapko mujhse kuch chahiye ho, freely sampark karein.",
        te: "Entani time lo vallu naa vachchagalaa, hesitate cheyaku.",
        ta: "Oru time la ungal enaku vachchugalaa, hesitates pannaku.",
      },
    },
    {
      id: "th-2",
      label: "Mention a specific moment",
      text: {
        en: "Your note about the demo in particular meant a lot to me.",
        hi: "Demo ke baare mein aapka wo note mujhe bahut kaam aaya.",
        te: "Demo vechi mee note naaku oru varama important ayyindi.",
        ta: "Demo vechi ungal note enaku oru varai important aayidhu.",
      },
    },
    {
      id: "th-3",
      label: "Reinforce commitment",
      text: {
        en: "I am already looking forward to the next milestone.",
        hi: "Main agli milestone ka intezaar kar raha hoon.",
        te: "Naan next milestone ki intejam unnavachchu.",
        ta: "Naan next milestone ku intejam aaguren.",
      },
    },
  ],
  custom: [
    {
      id: "cu-1",
      label: "Add a clear ask",
      text: {
        en: "Could you get back to me by Friday?",
        hi: "Kya aap Friday tak mere paas wapas aa sakte hain?",
        te: "Vallu Friday muddi naa reply aagiralaa?",
        ta: "Ungal Friday muddi nalla reply pannaagiralaa?",
      },
    },
    {
      id: "cu-2",
      label: "Add context",
      text: {
        en: "A bit of background: this comes from our earlier conversation.",
        hi: "Thoda background: yeh hamari pehli baat-cheet se aaya hai.",
        te: "Thoda background: ee meeda vachana pichchi vachanamu ninda vachindi.",
        ta: "Thodhu background: adhu nadangala pacha vachanama ninda vachidhu.",
      },
    },
    {
      id: "cu-3",
      label: "Stay friendly",
      text: {
        en: "Thanks in advance for your time on this.",
        hi: "Is par aapke time ke liye pehle se dhanyavaad.",
        te: "Ee valla mee time ki pealiki thank you.",
        ta: "Adhu valla ungal time ku oru mudama nazhakkam.",
      },
    },
  ],
};
