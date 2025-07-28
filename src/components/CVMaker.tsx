import React, { useState, useRef } from 'react';
// Import library untuk PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Download,
  Plus,
  Trash2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Calendar,
  Building,
  FileText,
  Palette,
  Loader2 // Import ikon loader
} from 'lucide-react';
import heroPattern from '@/assets/hero-pattern.jpg';

// Interface tetap sama
interface PersonalInfo {
  fullName: string;
  position: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  profileImage?: string;
}

interface WorkExperience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentJob: boolean;
}

interface Education {
  institution: string;
  major: string;
  graduationYear: string;
  gpa?: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education;
  skills: string[];
}

const CVMaker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [newSkill, setNewSkill] = useState('');
  // State baru untuk status loading download
  const [isDownloading, setIsDownloading] = useState(false); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref baru untuk menunjuk ke elemen preview CV
  const cvPreviewRef = useRef<HTMLDivElement>(null); 
  const { toast } = useToast();

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      position: '',
      email: '',
      phone: '',
      linkedin: '',
      location: ''
    },
    summary: '',
    workExperience: [],
    education: {
      institution: '',
      major: '',
      graduationYear: '',
      gpa: ''
    },
    skills: []
  });

  const steps = [
    { number: 1, title: 'Informasi Pribadi', icon: User },
    { number: 2, title: 'Ringkasan Profesional', icon: User },
    { number: 3, title: 'Pengalaman Kerja', icon: Briefcase },
    { number: 4, title: 'Pendidikan', icon: GraduationCap },
    { number: 5, title: 'Keahlian', icon: Sparkles }
  ];

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Desain bersih dan profesional' },
    { id: 'classic', name: 'Classic', description: 'Template tradisional yang elegan' },
    { id: 'creative', name: 'Creative', description: 'Desain kreatif dan eye-catching' }
  ];

  // Fungsi-fungsi lain (addWorkExperience, removeWorkExperience, dll) tetap sama...
  const addWorkExperience = () => {
    const newId = Date.now().toString();
    setCvData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        id: newId,
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        isCurrentJob: false
      }]
    }));
  };

  const removeWorkExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
  };

  const updateWorkExperience = (id: string, field: string, value: string | boolean) => {
    setCvData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      if (!cvData.skills.includes(newSkill.trim())) {
        setCvData(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill.trim()]
        }));
        setNewSkill('');
      } else {
        toast({
          title: "Skill sudah ada",
          description: "Skill tersebut sudah ditambahkan sebelumnya.",
          variant: "destructive"
        });
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File terlalu besar",
          description: "Ukuran file harus kurang dari 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCvData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            profileImage: e.target?.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSummaryWithAI = () => {
    const { fullName, position } = cvData.personalInfo;
    if (!fullName || !position) {
      toast({
        title: "Informasi tidak lengkap",
        description: "Lengkapi nama dan posisi terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }
    const aiSummary = `Saya adalah ${fullName} yang berpengalaman sebagai ${position}. Memiliki passion yang tinggi dalam mengembangkan solusi inovatif dan berkontribusi pada kesuksesan tim. Dengan latar belakang yang solid dan kemampuan adaptasi yang baik, saya siap menghadapi tantangan baru dan memberikan nilai tambah bagi perusahaan.`;
    setCvData(prev => ({ ...prev, summary: aiSummary }));
    toast({
      title: "Ringkasan berhasil dibuat!",
      description: "AI telah membuatkan ringkasan profesional untuk Anda.",
    });
  };

  const generateJobDescriptionWithAI = (experienceId: string) => {
    const experience = cvData.workExperience.find(exp => exp.id === experienceId);
    if (!experience?.position || !experience?.company) {
      toast({
        title: "Informasi tidak lengkap",
        description: "Lengkapi posisi dan nama perusahaan terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }
    const aiDescription = `Bertanggung jawab untuk mengelola dan mengembangkan proyek-proyek strategis di ${experience.company}. Melakukan koordinasi dengan tim lintas departemen untuk memastikan pencapaian target dan KPI yang telah ditetapkan. Mengimplementasikan best practices dan solusi inovatif untuk meningkatkan efisiensi operasional sebesar 20%.`;
    updateWorkExperience(experienceId, 'description', aiDescription);
    toast({
      title: "Deskripsi berhasil dibuat!",
      description: "AI telah membuatkan deskripsi pekerjaan profesional.",
    });
  };

  // --- FUNGSI DOWNLOAD PDF BARU ---
  const downloadPDF = () => {
    // Cek apakah elemen preview ada
    const capture = cvPreviewRef.current;
    if (!capture) {
      toast({
        title: "Gagal memuat preview",
        description: "Elemen preview CV tidak ditemukan.",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);
    toast({
      title: "Memproses CV Anda...",
      description: "Mohon tunggu, ini mungkin memakan waktu beberapa saat.",
    });

    html2canvas(capture, {
      scale: 2, // Meningkatkan skala untuk kualitas gambar yang lebih baik
      useCORS: true, // Diperlukan jika ada gambar dari sumber eksternal
      backgroundColor: null, // Menggunakan background dari elemen itu sendiri
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      
      // Kalkulasi tinggi gambar agar sesuai dengan lebar PDF
      const imgWidth = pdfWidth - 20; // Beri margin 10mm di setiap sisi
      const imgHeight = imgWidth / ratio;

      // Cek apakah tinggi gambar melebihi tinggi halaman
      if (imgHeight > pdfHeight - 20) {
        // Jika lebih tinggi, perlu penanganan multi-halaman (untuk saat ini kita buat sederhana)
        console.warn("Konten CV mungkin terlalu panjang untuk satu halaman PDF.");
      }

      const x = 10; // Posisi X dengan margin
      const y = 10; // Posisi Y dengan margin

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      const fileName = `CV_${cvData.personalInfo.fullName.replace(/\s/g, '_') || 'Professional'}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Download berhasil!",
        description: `${fileName} telah diunduh.`,
      });
    }).catch(err => {
      console.error("Error generating PDF:", err);
      toast({
        title: "Gagal membuat PDF",
        description: "Terjadi kesalahan saat mengonversi CV.",
        variant: "destructive"
      });
    }).finally(() => {
      setIsDownloading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-primary py-8">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroPattern})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              AI CV Maker
            </h1>
            <p className="text-white/90 text-lg">
              Buat CV profesional dengan bantuan AI dalam hitungan menit
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Input */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <Card className="p-6 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div 
                      key={step.number}
                      className={`flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 ${
                        currentStep === step.number 
                          ? 'text-primary' 
                          : currentStep > step.number 
                            ? 'text-accent' 
                            : 'text-muted-foreground'
                      }`}
                      onClick={() => setCurrentStep(step.number)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                        currentStep === step.number 
                          ? 'bg-primary border-primary text-white' 
                          : currentStep > step.number 
                            ? 'bg-accent border-accent text-white'
                            : 'border-muted-foreground'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-medium text-center hidden sm:block">
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </Card>

            {/* Form Content */}
            <Card className="p-6 shadow-soft">
              {/* Konten form tetap sama... */}
              {currentStep === 5 && (
                 <div className="space-y-6">
                 <div className="flex items-center space-x-2 mb-4">
                   <Sparkles className="text-primary" size={20} />
                   <h2 className="text-xl font-semibold">Keahlian & Finalisasi</h2>
                 </div>

                 {/* ... (bagian skill input sama) ... */}

                 <Separator className="my-6" />
                 
                 <div className="space-y-4">
                   <div className="flex items-center space-x-2">
                     <Palette className="text-primary" size={20} />
                     <Label>Pilih Template CV</Label>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {templates.map((template) => (
                       <Card
                         key={template.id}
                         className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                           selectedTemplate === template.id 
                             ? 'ring-2 ring-primary bg-primary/5' 
                             : ''
                         }`}
                         onClick={() => setSelectedTemplate(template.id)}
                       >
                         <div className="text-center space-y-2">
                           <h3 className="font-medium">{template.name}</h3>
                           <p className="text-sm text-muted-foreground">
                             {template.description}
                           </p>
                         </div>
                       </Card>
                     ))}
                   </div>
                 </div>

                 <Separator className="my-6" />
                 
                 <div className="text-center space-y-4">
                   <div className="space-y-2">
                     <h3 className="text-lg font-semibold">CV Anda Sudah Siap!</h3>
                     <p className="text-muted-foreground">
                       Unduh CV profesional Anda sekarang
                     </p>
                   </div>
                   
                   <Button 
                     size="lg" 
                     className="w-full"
                     onClick={downloadPDF}
                     disabled={isDownloading} // Nonaktifkan tombol saat loading
                   >
                     {isDownloading ? (
                       <>
                         <Loader2 size={20} className="mr-2 animate-spin" />
                         Memproses...
                       </>
                     ) : (
                       <>
                         <Download size={20} className="mr-2" />
                         Download CV sebagai PDF
                       </>
                     )}
                   </Button>
                 </div>
               </div>
              )}
              
              {/* ... (Konten form lainnya tetap sama) ... */}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Sebelumnya
                </Button>
                <Button 
                  onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                  disabled={currentStep === 5}
                >
                  Selanjutnya
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Panel - CV Preview */}
          <div className="lg:sticky lg:top-8">
             {/* Tambahkan ref ke Card ini */}
            <Card ref={cvPreviewRef} className="bg-white shadow-medium min-h-[600px]">
              {/* Wrapper baru untuk konten yang akan di-print */}
              <div className="p-6"> 
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Preview CV</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={downloadPDF} 
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <Download size={16} className="mr-2" />
                    )}
                    Download
                  </Button>
                </div>
                
                <Separator className="mb-6" />
                
                {/* CV Preview Content */}
                <div className="space-y-6 text-sm">
                  {/* ... (Seluruh konten preview CV tetap sama) ... */}
                   {/* Header Section */}
                <div className="text-center border-b pb-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {cvData.personalInfo.profileImage ? (
                      <img 
                        src={cvData.personalInfo.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-muted-foreground" size={24} />
                    )}
                  </div>
                  <h1 className="text-xl font-bold">
                    {cvData.personalInfo.fullName || 'Nama Lengkap'}
                  </h1>
                  <p className="text-primary font-medium">
                    {cvData.personalInfo.position || 'Posisi yang Diincar'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs text-muted-foreground">
                    {cvData.personalInfo.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={12} />
                        {cvData.personalInfo.email}
                      </span>
                    )}
                    {cvData.personalInfo.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} />
                        {cvData.personalInfo.phone}
                      </span>
                    )}
                    {cvData.personalInfo.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {cvData.personalInfo.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary Section */}
                {cvData.summary && (
                  <div>
                    <h2 className="font-semibold text-primary mb-2">TENTANG SAYA</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {cvData.summary}
                    </p>
                  </div>
                )}
                 {/* ... (konten preview lainnya) ... */}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVMaker;
