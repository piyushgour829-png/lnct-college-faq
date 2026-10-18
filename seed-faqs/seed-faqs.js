// Run once from your LNCT-College-FAQ folder: node seed-faqs.js
// Adds sample FAQs to the same MongoDB database used by server.js.
// Existing FAQs are preserved; questions already present (case-insensitive) are skipped.
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lnct_faq";
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true, minlength: 5, maxlength: 250 },
  category: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  answer: { type: String, required: true, trim: true, minlength: 5, maxlength: 2000 }
}, { timestamps: true });
const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
const faqs = [
  {
    "category": "Admission & Eligibility",
    "question": "How can I take admission in LNCT?",
    "answer": "Admission depends on the course, eligibility criteria and the current admission process. Check the official LNCT admission portal or contact the admissions office for the latest instructions."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Which entrance exams are accepted for B.Tech admission?",
    "answer": "Accepted entrance exams and admission routes may vary by programme and academic year. Confirm the current criteria with the admissions office."
  },
  {
    "category": "Admission & Eligibility",
    "question": "What is the eligibility for B.Tech?",
    "answer": "Eligibility depends on the applicable admission rules, qualifying subjects, marks and admission route. Check the current official prospectus."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Which documents are required for admission?",
    "answer": "Commonly requested documents include Class 10 and 12 marksheets, identity proof, photographs, entrance-exam documents and applicable category or domicile certificates."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Can I get admission without JEE?",
    "answer": "Admission routes may differ by programme and year. Contact the admissions office to confirm whether an alternative route is available."
  },
  {
    "category": "Admission & Eligibility",
    "question": "How can I apply online for admission?",
    "answer": "Visit the official college admission website, choose your programme and follow the current application instructions."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Is direct admission available?",
    "answer": "Availability depends on current admission rules, eligibility and seat availability. Verify directly with the admissions office."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Can students from other states apply?",
    "answer": "Students from other states can check the programme eligibility and applicable admission process with the admissions office."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Is there a minimum percentage requirement?",
    "answer": "The minimum percentage depends on the programme and applicable admission rules for the academic year."
  },
  {
    "category": "Admission & Eligibility",
    "question": "How can I check my admission status?",
    "answer": "Use the official admission portal if available, or contact the admissions office with your application details."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Can I change my branch after admission?",
    "answer": "Branch changes depend on college policy, vacancies and academic rules. Ask the admissions or academic office."
  },
  {
    "category": "Admission & Eligibility",
    "question": "When does the admission process start?",
    "answer": "Admission dates vary by programme and academic year. Check the latest official notification."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Are scholarships available for new students?",
    "answer": "Scholarships may depend on merit, eligibility, category and current government or institutional schemes."
  },
  {
    "category": "Admission & Eligibility",
    "question": "How do I cancel my admission?",
    "answer": "Contact the admissions office and request the current cancellation and refund procedure in writing."
  },
  {
    "category": "Admission & Eligibility",
    "question": "Where can I ask admission-related questions?",
    "answer": "Contact the official admissions office using the verified contact details published by the college."
  },
  {
    "category": "Fees & Scholarships",
    "question": "What is the B.Tech fee at LNCT?",
    "answer": "Fees depend on programme, batch, applicable charges and academic year. Refer to the official fee structure."
  },
  {
    "category": "Fees & Scholarships",
    "question": "How can I pay college fees?",
    "answer": "Use only payment methods authorised by the college and listed in the official fee instructions."
  },
  {
    "category": "Fees & Scholarships",
    "question": "Can I pay fees in instalments?",
    "answer": "Instalment options depend on the current fee policy. Confirm with the accounts office."
  },
  {
    "category": "Fees & Scholarships",
    "question": "Where can I get a fee receipt?",
    "answer": "Download it from the official student portal if available, or request it from the accounts office."
  },
  {
    "category": "Fees & Scholarships",
    "question": "What happens if I pay fees late?",
    "answer": "Late-payment rules and any applicable charges are governed by the current college policy."
  },
  {
    "category": "Fees & Scholarships",
    "question": "How do I apply for a scholarship?",
    "answer": "Check the official scholarship notice and submit the required application and supporting documents before the deadline."
  },
  {
    "category": "Fees & Scholarships",
    "question": "Are government scholarships available?",
    "answer": "Eligible students may be able to apply for relevant government schemes, subject to current rules and deadlines."
  },
  {
    "category": "Fees & Scholarships",
    "question": "Is there a fee refund policy?",
    "answer": "Refunds depend on the applicable policy, admission rules and deadlines. Request the current written policy."
  },
  {
    "category": "Fees & Scholarships",
    "question": "Can I get a duplicate fee receipt?",
    "answer": "Contact the accounts office or check the student portal for a duplicate receipt option."
  },
  {
    "category": "Fees & Scholarships",
    "question": "How can I correct a fee payment error?",
    "answer": "Keep the transaction reference and receipt, then contact the accounts office or authorised payment support."
  },
  {
    "category": "Fees & Scholarships",
    "question": "Does the fee include hostel charges?",
    "answer": "Hostel and mess charges may be separate. Verify the official fee breakdown."
  },
  {
    "category": "Fees & Scholarships",
    "question": "Who handles fee-related queries?",
    "answer": "The accounts or fee office handles fee statements, receipts and payment queries."
  },
  {
    "category": "Academics & Departments",
    "question": "Which courses are offered at LNCT?",
    "answer": "Course availability varies by campus and academic year. Check the current official course list."
  },
  {
    "category": "Academics & Departments",
    "question": "Does LNCT offer CSE with AI and ML?",
    "answer": "Confirm the current programme name, intake and availability in the official course list."
  },
  {
    "category": "Academics & Departments",
    "question": "Where can I find my syllabus?",
    "answer": "Check the official university or college academic portal for the syllabus applicable to your course and batch."
  },
  {
    "category": "Academics & Departments",
    "question": "How can I get my class timetable?",
    "answer": "Check the official student portal, department notice board or latest department announcement."
  },
  {
    "category": "Academics & Departments",
    "question": "Who is my faculty mentor?",
    "answer": "Ask your department office or check the official mentoring allocation if available."
  },
  {
    "category": "Academics & Departments",
    "question": "How do I contact my Head of Department?",
    "answer": "Use the verified department directory or contact the department office."
  },
  {
    "category": "Academics & Departments",
    "question": "Are practical labs conducted regularly?",
    "answer": "Practical schedules depend on the course timetable and department instructions."
  },
  {
    "category": "Academics & Departments",
    "question": "Where can I get lecture notes?",
    "answer": "Check faculty-shared resources, the learning portal or department-approved platforms."
  },
  {
    "category": "Academics & Departments",
    "question": "Are extra classes conducted?",
    "answer": "Extra classes may be scheduled by the department when required. Follow official announcements."
  },
  {
    "category": "Academics & Departments",
    "question": "How can I get an attendance report?",
    "answer": "Check the student portal if available, or request your attendance record from the department."
  },
  {
    "category": "Academics & Departments",
    "question": "What is the minimum attendance requirement?",
    "answer": "The applicable attendance requirement depends on university and college rules. Check the current regulations."
  },
  {
    "category": "Academics & Departments",
    "question": "Can I attend another section’s class?",
    "answer": "This requires permission under the applicable department policy. Ask your faculty or department office."
  },
  {
    "category": "Academics & Departments",
    "question": "How can I get the academic calendar?",
    "answer": "Check the official college or university website for the current academic calendar."
  },
  {
    "category": "Academics & Departments",
    "question": "Where can I find faculty office hours?",
    "answer": "Ask the department office or check faculty announcements."
  },
  {
    "category": "Academics & Departments",
    "question": "How can I request academic support?",
    "answer": "Contact your subject faculty, mentor or department coordinator."
  },
  {
    "category": "Exams & Results",
    "question": "Who conducts the semester exams?",
    "answer": "The responsible examination authority depends on the programme and applicable university rules."
  },
  {
    "category": "Exams & Results",
    "question": "How can I download my admit card?",
    "answer": "Use the official examination portal or follow the latest examination-cell instructions."
  },
  {
    "category": "Exams & Results",
    "question": "What should I do if my admit card has an error?",
    "answer": "Report the error to the examination cell immediately with supporting documents."
  },
  {
    "category": "Exams & Results",
    "question": "Where is the exam timetable published?",
    "answer": "Check the official university or college examination notice."
  },
  {
    "category": "Exams & Results",
    "question": "How can I check my results?",
    "answer": "Use the official result portal specified by your university or examination authority."
  },
  {
    "category": "Exams & Results",
    "question": "What if I fail a subject?",
    "answer": "Check the current supplementary or back-paper examination rules and consult your department."
  },
  {
    "category": "Exams & Results",
    "question": "How can I apply for revaluation?",
    "answer": "Follow the official revaluation procedure and deadline announced by the examination authority."
  },
  {
    "category": "Exams & Results",
    "question": "What is a back paper?",
    "answer": "A back paper is an examination a student may need to clear after not passing a subject, according to applicable rules."
  },
  {
    "category": "Exams & Results",
    "question": "How can I correct marksheet details?",
    "answer": "Contact the examination cell and submit the required correction request and evidence."
  },
  {
    "category": "Exams & Results",
    "question": "Can I get a duplicate marksheet?",
    "answer": "Request it through the authorised university or examination office procedure."
  },
  {
    "category": "Exams & Results",
    "question": "When are internal assessments conducted?",
    "answer": "Dates are set by the department and academic calendar. Follow official notices."
  },
  {
    "category": "Exams & Results",
    "question": "What if I miss an internal exam?",
    "answer": "Contact your faculty and department immediately; any retest depends on applicable rules."
  },
  {
    "category": "Exams & Results",
    "question": "Where can I find previous-year papers?",
    "answer": "Check authorised university resources, the library or department-shared materials."
  },
  {
    "category": "Exams & Results",
    "question": "Who can answer examination queries?",
    "answer": "Contact the examination cell or your department office."
  },
  {
    "category": "Placements & Internships",
    "question": "Does LNCT have a placement cell?",
    "answer": "Check the current official campus directory for placement and training services."
  },
  {
    "category": "Placements & Internships",
    "question": "How can I register for placements?",
    "answer": "Follow the placement cell’s official registration instructions and deadlines."
  },
  {
    "category": "Placements & Internships",
    "question": "Which companies visit the campus?",
    "answer": "Recruiting companies vary each year. Refer to verified placement announcements."
  },
  {
    "category": "Placements & Internships",
    "question": "What is the average placement package?",
    "answer": "Use the latest official placement report for the relevant campus, course and graduating batch."
  },
  {
    "category": "Placements & Internships",
    "question": "What is the highest placement package?",
    "answer": "The figure varies by batch and reporting methodology. Check the latest verified placement report."
  },
  {
    "category": "Placements & Internships",
    "question": "Are internships available?",
    "answer": "Opportunities may be shared through the placement cell, departments and approved external platforms."
  },
  {
    "category": "Placements & Internships",
    "question": "How do I prepare for campus placements?",
    "answer": "Practise aptitude, programming, communication, technical interviews and resume preparation."
  },
  {
    "category": "Placements & Internships",
    "question": "Are coding skills required for CSE placements?",
    "answer": "Many technical roles test coding and problem-solving. Requirements depend on the employer and role."
  },
  {
    "category": "Placements & Internships",
    "question": "Can first-year students apply for internships?",
    "answer": "Eligibility varies by employer and programme. Read each internship’s requirements carefully."
  },
  {
    "category": "Placements & Internships",
    "question": "How can I create a resume?",
    "answer": "Include your education, relevant skills, projects, certifications and achievements accurately."
  },
  {
    "category": "Placements & Internships",
    "question": "Are mock interviews conducted?",
    "answer": "Check with the placement cell for current training, mock interview and aptitude-session schedules."
  },
  {
    "category": "Placements & Internships",
    "question": "Can I attend off-campus placement drives?",
    "answer": "Students can explore legitimate off-campus opportunities while following college rules."
  },
  {
    "category": "Placements & Internships",
    "question": "Who handles placement queries?",
    "answer": "Contact the official placement or training and placement office."
  },
  {
    "category": "Hostel & Mess",
    "question": "Does LNCT provide hostel facilities?",
    "answer": "Hostel availability depends on the campus and current accommodation arrangements. Confirm with the hostel office."
  },
  {
    "category": "Hostel & Mess",
    "question": "How can I apply for a hostel room?",
    "answer": "Request the current application form and allocation procedure from the authorised hostel office."
  },
  {
    "category": "Hostel & Mess",
    "question": "What are the hostel fees?",
    "answer": "Fees depend on room type, facilities and academic year. Check the official hostel fee schedule."
  },
  {
    "category": "Hostel & Mess",
    "question": "Is mess food included in hostel fees?",
    "answer": "Check the current fee breakdown to confirm whether mess charges are included or separate."
  },
  {
    "category": "Hostel & Mess",
    "question": "What are the hostel timings?",
    "answer": "Follow the current hostel rules and timings issued by the hostel administration."
  },
  {
    "category": "Hostel & Mess",
    "question": "Can I choose my roommate?",
    "answer": "Roommate preferences depend on room availability and hostel policy."
  },
  {
    "category": "Hostel & Mess",
    "question": "Can day scholars use the hostel mess?",
    "answer": "This depends on the current mess policy. Ask the hostel administration."
  },
  {
    "category": "Hostel & Mess",
    "question": "How can I report a hostel maintenance issue?",
    "answer": "Report it to the hostel warden or authorised maintenance team."
  },
  {
    "category": "Hostel & Mess",
    "question": "What if I lose my hostel ID?",
    "answer": "Inform the hostel office and ask about ID replacement."
  },
  {
    "category": "Hostel & Mess",
    "question": "Are visitors allowed in hostels?",
    "answer": "Visitor access is governed by hostel security rules and permitted timings."
  },
  {
    "category": "Hostel & Mess",
    "question": "Can I leave the hostel overnight?",
    "answer": "Follow the official outpass or leave-approval process."
  },
  {
    "category": "Hostel & Mess",
    "question": "Who should I contact for hostel complaints?",
    "answer": "Contact the hostel warden or designated hostel administration office."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "Does LNCT provide college buses?",
    "answer": "Transport availability and routes depend on the campus and current transport arrangements."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "How can I find my bus route?",
    "answer": "Check the latest official transport route list or ask the transport office."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "What are the college bus timings?",
    "answer": "Timings can change by route and academic schedule. Confirm the current timetable."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "How can I apply for a bus pass?",
    "answer": "Ask the transport office for the current registration and payment process."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "Can I change my bus stop?",
    "answer": "Stop changes depend on route capacity and transport-office approval."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "Where is the main entrance?",
    "answer": "Use the verified campus map or navigation section in the project."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "How can I find my department building?",
    "answer": "Search the department in the campus navigation directory once its location has been verified."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "Where is the library?",
    "answer": "Use the official campus map or ask campus reception for directions."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "How can I locate the computer lab?",
    "answer": "Search the relevant lab in the campus directory or ask the department office."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "Where is the administrative office?",
    "answer": "Check the verified campus directory or ask reception."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "How do I reach the canteen?",
    "answer": "Use the campus map and follow verified internal paths."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "Where is the sports ground?",
    "answer": "Check the campus directory or ask the sports department for the current location."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "How can visitors find the campus?",
    "answer": "Use the official campus address and a reliable navigation service."
  },
  {
    "category": "Transport & Campus Navigation",
    "question": "What if a campus location is missing from the map?",
    "answer": "Report the missing location to the project administrator so it can be verified and added."
  },
  {
    "category": "Library & Labs",
    "question": "What are the library opening hours?",
    "answer": "Library hours can vary by campus, day and examination period. Check the latest notice."
  },
  {
    "category": "Library & Labs",
    "question": "How do I get a library card?",
    "answer": "Follow the library registration procedure and provide the requested student details."
  },
  {
    "category": "Library & Labs",
    "question": "How many books can I borrow?",
    "answer": "Borrowing limits and loan periods depend on current library rules."
  },
  {
    "category": "Library & Labs",
    "question": "What happens if I return a book late?",
    "answer": "Any overdue charges or restrictions depend on the library’s current policy."
  },
  {
    "category": "Library & Labs",
    "question": "Can I renew a borrowed book?",
    "answer": "Renewal depends on the library system, book availability and loan rules."
  },
  {
    "category": "Library & Labs",
    "question": "Can I access e-books?",
    "answer": "Ask the library which digital resources and subscriptions are currently available."
  },
  {
    "category": "Library & Labs",
    "question": "How do I find a book?",
    "answer": "Use the library catalogue if available, or ask library staff for help."
  },
  {
    "category": "Library & Labs",
    "question": "Can I use library computers?",
    "answer": "Access depends on library rules and computer availability."
  },
  {
    "category": "Library & Labs",
    "question": "How do I report a damaged book?",
    "answer": "Inform library staff and follow their instructions."
  },
  {
    "category": "Library & Labs",
    "question": "Who handles lab equipment issues?",
    "answer": "Report the issue to the lab assistant or faculty in charge."
  },
  {
    "category": "Student Life & Sports",
    "question": "Are cultural events organised at LNCT?",
    "answer": "Events depend on the current college calendar and organising committees."
  },
  {
    "category": "Student Life & Sports",
    "question": "How can I participate in college festivals?",
    "answer": "Follow official event announcements and registration instructions."
  },
  {
    "category": "Student Life & Sports",
    "question": "Are sports facilities available?",
    "answer": "Check current campus sports facilities and access rules with the sports department."
  },
  {
    "category": "Student Life & Sports",
    "question": "How can I join the badminton team?",
    "answer": "Contact the sports department or coach for trials, eligibility and practice schedules."
  },
  {
    "category": "Student Life & Sports",
    "question": "How can I join the volleyball team?",
    "answer": "Ask the sports department about team selection and practice timings."
  },
  {
    "category": "Student Life & Sports",
    "question": "Are technical clubs available?",
    "answer": "Check the current student-club list and official club announcements."
  },
  {
    "category": "Student Life & Sports",
    "question": "How can I start a student club?",
    "answer": "Ask the student affairs office about recognition, approvals and club requirements."
  },
  {
    "category": "Student Life & Sports",
    "question": "How can I volunteer at events?",
    "answer": "Watch official event announcements or contact the event organisers."
  },
  {
    "category": "Student Life & Sports",
    "question": "Where can I see upcoming events?",
    "answer": "Check the verified notice board or events section in the college FAQ project."
  },
  {
    "category": "Student Life & Sports",
    "question": "How can I submit an event notice?",
    "answer": "Use the authorised admin workflow or contact the event coordinator."
  },
  {
    "category": "Student Life & Sports",
    "question": "Are competitions held on campus?",
    "answer": "Competitions depend on the academic calendar and student-organised events."
  },
  {
    "category": "Student Life & Sports",
    "question": "Who can help with student activity queries?",
    "answer": "Contact the student affairs office or the relevant club coordinator."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I get my student ID card?",
    "answer": "Follow the college ID-card issuance procedure through the authorised office."
  },
  {
    "category": "IT & Student Support",
    "question": "What should I do if I lose my ID card?",
    "answer": "Report it to the designated office and ask about blocking or replacement."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I reset my student portal password?",
    "answer": "Use the official password-reset process or contact authorised IT support."
  },
  {
    "category": "IT & Student Support",
    "question": "What if the college Wi-Fi is not working?",
    "answer": "Check your device settings and report persistent issues to authorised IT support."
  },
  {
    "category": "IT & Student Support",
    "question": "How do I get a bonafide certificate?",
    "answer": "Ask the student section or administration office for the application procedure."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I request a transfer certificate?",
    "answer": "Contact the authorised student or administration section for current requirements."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I correct my personal details?",
    "answer": "Submit a correction request with supporting documents to the relevant office."
  },
  {
    "category": "IT & Student Support",
    "question": "How do I report a campus safety concern?",
    "answer": "Contact campus security or the designated college authority immediately."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I submit a complaint?",
    "answer": "Use the official grievance process and retain your complaint reference if provided."
  },
  {
    "category": "IT & Student Support",
    "question": "Is there a student grievance committee?",
    "answer": "Check the official college policies and current committee information."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I contact the college office?",
    "answer": "Use verified contact details from the official college website or directory."
  },
  {
    "category": "IT & Student Support",
    "question": "Can parents contact the college?",
    "answer": "Parents or guardians can use official office contact channels for relevant queries."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I get a certificate for an event?",
    "answer": "Contact the event organiser or relevant department to confirm eligibility and issue procedure."
  },
  {
    "category": "IT & Student Support",
    "question": "How can I suggest a new FAQ?",
    "answer": "Submit the question to the project administrator for review and approval."
  }
];
(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    const existing = await FAQ.find({}, { question: 1 }).lean();
    const normalise = value => String(value || "").trim().toLocaleLowerCase();
    const seen = new Set(existing.map(item => normalise(item.question)));
    const fresh = faqs.filter(item => {
      const key = normalise(item.question);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (fresh.length) await FAQ.insertMany(fresh, { ordered: false });
    console.log(`FAQ import complete. Added: ${fresh.length}; skipped existing: ${faqs.length - fresh.length}; total in database: ${existing.length + fresh.length}.`);
    console.log("Note: these are sample answers; verify campus-specific facts before publishing.");
  } catch (error) {
    console.error("FAQ import failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
