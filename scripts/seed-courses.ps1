$api = "http://localhost:5173/api/data/courses"

$courses = @(
    @{
        title = "Diploma in Montessori Teacher Training Course"
        category = "Teacher Training"
        duration = "10 Months"
        mode = "Online"
        description = "The Diploma in Montessori Teacher Training is a specialized program designed for individuals who wish to become certified Montessori educators. The Montessori method of education emphasizes child-centered learning, fostering independence, and promoting self-directed learning in a supportive environment. This course equips students with the essential knowledge and practical skills to teach young children, typically ages 2 to 6, using the Montessori approach. Duration: 10 Months. Qualification: 12th & above."
        link = "/courses/montessori-diploma"
    }
    @{
        title = "Certificate in Nursery Teacher Training Course (NTT)"
        category = "Teacher Training"
        duration = "10 Months"
        mode = "Online"
        description = "The Certificate in Nursery Teacher Training (NTT) is an entry-level program designed to equip individuals with the essential knowledge and skills needed to teach and care for young children, typically aged 2 to 6 years, in nursery and preschool settings. This course provides a solid foundation in early childhood education, covering key aspects of child development, teaching methodologies, and classroom management. Duration: 10 Months. Qualification: 12th & above."
        link = "/courses/ntt-certificate"
    }
    @{
        title = "The Diploma in Nursery Teacher Training Course (NTTC)"
        category = "Teacher Training"
        duration = "10 Months"
        mode = "Online"
        description = "The Diploma in Nursery Teacher Training (NTT) is a specialized program designed to train individuals to become qualified teachers in early childhood education. It equips students with the knowledge, skills, and techniques necessary to teach and care for children in the foundational stages of their education, typically from ages 2 to 5 years. The course covers a wide range of topics related to child development, teaching strategies, and classroom management. Duration: 10 Months. Qualification: 12th & above."
        link = "/courses/nttc-diploma"
    }
    @{
        title = "Advanced Diploma in Preprimary Montessori Teacher Training Course"
        category = "Teacher Training"
        duration = "1 Year"
        mode = "Online"
        description = "The Advanced Diploma in Preprimary Montessori Teacher Training is a comprehensive program designed for individuals who wish to specialize in teaching young children (ages 2 to 6) using the Montessori method. This advanced course builds on foundational Montessori principles and equips students with deeper knowledge and advanced teaching techniques to effectively manage Montessori classrooms, design a curriculum, and address the individual needs of children in preprimary settings. Duration: 1 Year. Qualification: 10th & above."
        link = "/courses/preprimary-montessori-advanced"
    }
    @{
        title = "Diploma in Preprimary Montessori Teacher Training Course"
        category = "Teacher Training"
        duration = "1 Year"
        mode = "Online"
        description = "The Diploma in Preprimary Montessori Teacher Training is a specialized program designed for individuals who wish to teach children in preprimary (ages 2 to 6) settings using the Montessori method. This course focuses on preparing teachers to create a nurturing and stimulating learning environment that supports the holistic development of young children. Duration: 1 Year. Qualification: 10th & above."
        link = "/courses/preprimary-montessori-diploma"
    }
    @{
        title = "Advanced Diploma in Montessori Teacher Training Course"
        category = "Teacher Training"
        duration = "10 Months"
        mode = "Online"
        description = "The Advanced Diploma in Montessori Teacher Training is an in-depth program designed for individuals who want to specialize in Montessori education at a more advanced level. This course builds on the foundational principles of Montessori education, providing students with a deeper understanding of child development, advanced teaching methodologies, and the ability to manage and lead Montessori classrooms effectively. Duration: 10 Months. Qualification: 12th & above."
        link = "/courses/montessori-advanced"
    }
    @{
        title = "Certificate in Early Childhood Care and Education (ECCE)"
        category = "Early Childhood Education"
        duration = "1 Year"
        mode = "Online"
        description = "The Certificate in Early Childhood Care and Education (ECCE) is a foundational program designed for individuals who aspire to work in the field of early childhood education, focusing on the care and development of children from birth to 8 years old. This course provides essential knowledge and skills needed to create a nurturing, educational, and safe environment for young children. With the added benefit of 100% Placement Assistance. Duration: 1 Year. Qualification: 10th."
        link = "/courses/ecce-certificate"
    }
    @{
        title = "Advanced Diploma in Nursery Teacher Training Course (NTT)"
        category = "Teacher Training"
        duration = "10 Months"
        mode = "Online"
        description = "The Advanced Diploma in Nursery Teacher Training (NTT) is a comprehensive, specialized program designed for individuals who wish to enhance their knowledge and skills in early childhood education. This course builds on the foundational principles of nursery teacher training and focuses on advanced teaching strategies, child development theories, and practical classroom management techniques tailored to the needs of young children, typically aged 2 to 6 years. Duration: 10 Months. Qualification: 12th & above."
        link = "/courses/ntt-advanced"
    }
    @{
        title = "Certificate in Nursery Teacher Training Course (NTT) with 100% Placement"
        category = "Teacher Training"
        duration = "1 Year"
        mode = "Online"
        description = "The Certificate in Nursery Teacher Training (NTT) course is an essential qualification for individuals aspiring to become effective and qualified nursery teachers. This course focuses on equipping candidates with the knowledge and skills needed to teach and care for children in the age group of 2 to 6 years. With the added benefit of 100% Placement Assistance, graduates are assured of the support needed to secure a job in early childhood education. Duration: 1 Year. Qualification: 12th & above."
        link = "/courses/ntt-placement"
    }
    @{
        title = "Advanced Diploma in Early Childhood Care and Education"
        category = "Early Childhood Education"
        duration = "1 Year"
        mode = "Online"
        description = "The Advanced Diploma in Early Childhood Care and Education is a specialized program designed to equip individuals with in-depth knowledge and practical skills in early childhood education, focusing on the care and development of children from birth to 8 years old."
        link = "/courses/ecce-advanced"
    }
    @{
        title = "Diploma in Nursery Teacher Training Course (NTTC)"
        category = "Teacher Training"
        duration = "1 Year"
        mode = "Online"
        description = "The Diploma in Nursery Teacher Training (NTT) is a specialized program designed to train individuals to become qualified teachers in early childhood education."
        link = "/courses/nttc-diploma-2"
    }
    @{
        title = "Diploma in Early Childhood Care and Education"
        category = "Early Childhood Education"
        duration = "1 Year"
        mode = "Online"
        description = "Our early childhood development courses have been carefully planned by experienced professionals in the field of preschool education. Our teacher training courses provide comprehensive knowledge and practical skills for early childhood education."
        link = "/courses/ecce-diploma"
    }
    @{
        title = "Certificate in Early Childhood Care and Education"
        category = "Early Childhood Education"
        duration = "12 Months"
        mode = "Online"
        description = "We are providing 12 months Montessori placement linked training course for eligible candidates all over India. After the successful completion of training, each candidate receives placement assistance."
        link = "/courses/ecce-certificate-2"
    }
)

$count = 0
foreach ($course in $courses) {
    $json = $course | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri $api -Method POST -Body $json -ContentType "application/json"
        $count++
        Write-Host "[OK] $($course.title)"
    } catch {
        Write-Host "[FAIL] $($course.title): $_"
    }
}

Write-Host "`nSeeded $count courses successfully."
