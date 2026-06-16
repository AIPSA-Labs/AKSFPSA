$api = "http://localhost:5173/api/data/services"

$services = @(
    @{ title = "School Development Activities"; description = "AIPSA will help the school to increase the number/ strength of students and teacher student's ratio will be ensured by increasing goodwill of the school and by creating school branding which will be done by the AIPSA team with professionals, School Development Officers."; icon = "Building2"; order = 1 }
    @{ title = "Admission Boost Up Program"; description = "To help uneconomic private schools to be profitable by increasing the number of admissions / students by implementing quality improvement programs (QIP) and school branding."; icon = "Users"; order = 2 }
    @{ title = "Teachers' Pension Plan for Member Schools"; description = "Teachers those who have 15 years of experience in the member schools under associations are eligible for the pension scheme sponsored by CWSE (COUNCIL FOR THE WELFARE OF SCHOOL EDUCATORS) Ltd."; icon = "Award"; order = 3 }
    @{ title = "School Developmental Fund"; description = "To provide interest free loan and grant to the selected school as per the norms set by the bankers and CWSE Ltd. company."; icon = "School"; order = 4 }
    @{ title = "Free Medical Camps"; description = "Three times in a year for each member school in association with IMA & IDA for students, parents and public. For each member school who follows the unified curriculum."; icon = "Users"; order = 5 }
    @{ title = "Teacher Training and Faculty Development"; description = "Through collaborative training programs, workshops, and seminars, AIPSA would invest in professional development opportunities for teachers, enabling them to enhance their teaching methodologies and stay updated with the latest pedagogical practices."; icon = "Monitor"; order = 6 }
    @{ title = "Communicative English Language Training and Appointment of CE Teacher"; description = "Communicative English Language Training and Appointment of CE (Communicative English) Teacher with curriculum under training for English language development in collaboration with Cambridge English Club."; icon = "BookOpen"; order = 7 }
    @{ title = "Modern Parenting - Parental Awareness Classes"; description = "Equip parents of member schools with the necessary knowledge, providing counselling, seminars, workshops, etc. on how to navigate the challenges of modern times. Screen Addiction & Cyber Safety for students are also included."; icon = "Users"; order = 8 }
    @{ title = "Establishment of Montessori Teachers Centre / Institute"; description = "With a view to empower women by giving job opportunities and become self-independent if any member school so desires. And also by implementing Faculty Development Program in schools which help the schools to earn more income in an year by making the school as the study cum exam centre of our courses."; icon = "GraduationCap"; order = 9 }
    @{ title = "Legal Services"; description = "NOC, ESI, EPF & RTE support, plus legal assistance for affiliation extension, school recognition, upgrades, and compliance services."; icon = "Scale"; order = 10 }
    @{ title = "Schools' Affiliation with CBSE and State Boards"; description = "Member Schools will be aided / facilitated in schools affiliation process with CBSE or any other State."; icon = "School"; order = 11 }
    @{ title = "Teacher Training and Faculty Development Program"; description = "Through collaborative training programs, workshops, and seminars, AIPSA would invest in professional development opportunities for teachers."; icon = "GraduationCap"; order = 12 }
    @{ title = "Curriculum Enhancement"; description = "The unified curriculum of AIPSA would facilitate the development of a comprehensive and standardized curriculum that aligns with the evolving educational needs."; icon = "Building2"; order = 13 }
)

$count = 0
foreach ($s in $services) {
    $json = $s | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri $api -Method POST -Body $json -ContentType "application/json"
        $count++
        Write-Host "[OK] $($s.title)"
    } catch {
        Write-Host "[FAIL] $($s.title): $_"
    }
}

Write-Host "`nSeeded $count services successfully."
