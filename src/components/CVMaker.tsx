import React, { useState, useRef } from 'react';
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
  Palette
} from 'lucide-react';
import heroPattern from '@/assets/hero-pattern.jpg';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Work Experience functions
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

  // Skills functions
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

  // File upload function
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

  // AI Functions (Simulasi)
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

    // Simulasi AI generation
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

    // Simulasi AI generation
    const aiDescription = `Bertanggung jawab untuk mengelola dan mengembangkan proyek-proyek strategis di ${experience.company}. Melakukan koordinasi dengan tim lintas departemen untuk memastikan pencapaian target dan KPI yang telah ditetapkan. Mengimplementasikan best practices dan solusi inovatif untuk meningkatkan efisiensi operasional sebesar 20%.`;
    
    updateWorkExperience(experienceId, 'description', aiDescription);
    toast({
      title: "Deskripsi berhasil dibuat!",
      description: "AI telah membuatkan deskripsi pekerjaan profesional.",
    });
  };

  // Download PDF function (simulasi)
  const downloadPDF = () => {
    toast({
      title: "Memproses download...",
      description: "CV Anda sedang dikonversi ke PDF. Tunggu sebentar.",
    });
    
    // Simulasi proses download
    setTimeout(() => {
      toast({
        title: "Download berhasil!",
        description: `CV_${cvData.personalInfo.fullName || 'Professional'}.pdf telah diunduh.`,
      });
    }, 2000);
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
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="text-primary" size={20} />
                    <h2 className="text-xl font-semibold">Informasi Pribadi</h2>
                  </div>

                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <div 
                      className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors overflow-hidden"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {cvData.personalInfo.profileImage ? (
                        <img 
                          src={cvData.personalInfo.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="text-primary" size={24} />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label className="text-sm text-muted-foreground">
                      Klik untuk upload foto profil
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        value={cvData.personalInfo.fullName}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Posisi yang Diincar *</Label>
                      <Input
                        id="position"
                        value={cvData.personalInfo.position}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, position: e.target.value }
                        }))}
                        placeholder="cth: Frontend Developer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          value={cvData.personalInfo.email}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }))}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          id="phone"
                          className="pl-10"
                          value={cvData.personalInfo.phone}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                          placeholder="+62 xxx-xxxx-xxxx"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          id="linkedin"
                          className="pl-10"
                          value={cvData.personalInfo.linkedin}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                          }))}
                          placeholder="linkedin.com/in/yourname"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Lokasi</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-muted-foreground" size={16} />
                        <Input
                          id="location"
                          className="pl-10"
                          value={cvData.personalInfo.location}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value }
                          }))}
                          placeholder="Jakarta, Indonesia"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Summary */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="text-primary" size={20} />
                    <h2 className="text-xl font-semibold">Ringkasan Profesional</h2>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="summary">Tentang Saya</Label>
                    <Textarea
                      id="summary"
                      rows={6}
                      value={cvData.summary}
                      onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Ceritakan tentang diri Anda, pengalaman, dan tujuan karir..."
                      className="resize-none"
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={generateSummaryWithAI}
                    >
                      <Sparkles className="mr-2" size={16} />
                      Buatkan Ringkasan dengan AI ✨
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Work Experience */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="text-primary" size={20} />
                      <h2 className="text-xl font-semibold">Pengalaman Kerja</h2>
                    </div>
                    <Button size="sm" onClick={addWorkExperience}>
                      <Plus size={16} className="mr-2" />
                      Tambah
                    </Button>
                  </div>

                  {cvData.workExperience.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Belum ada pengalaman kerja yang ditambahkan.</p>
                      <Button className="mt-4" onClick={addWorkExperience}>
                        <Plus size={16} className="mr-2" />
                        Tambah Pengalaman Pertama
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.workExperience.map((experience, index) => (
                        <Card key={experience.id} className="p-4 border-l-4 border-l-primary">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-primary">Pengalaman {index + 1}</h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeWorkExperience(experience.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label>Posisi Pekerjaan *</Label>
                              <Input
                                value={experience.position}
                                onChange={(e) => updateWorkExperience(experience.id, 'position', e.target.value)}
                                placeholder="cth: Frontend Developer"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Nama Perusahaan *</Label>
                              <div className="relative">
                                <Building className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                <Input
                                  className="pl-10"
                                  value={experience.company}
                                  onChange={(e) => updateWorkExperience(experience.id, 'company', e.target.value)}
                                  placeholder="cth: PT. Teknologi Indonesia"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label>Tanggal Mulai</Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                <Input
                                  type="month"
                                  className="pl-10"
                                  value={experience.startDate}
                                  onChange={(e) => updateWorkExperience(experience.id, 'startDate', e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Tanggal Selesai</Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-muted-foreground" size={16} />
                                <Input
                                  type="month"
                                  className="pl-10"
                                  value={experience.endDate}
                                  onChange={(e) => updateWorkExperience(experience.id, 'endDate', e.target.value)}
                                  disabled={experience.isCurrentJob}
                                  placeholder={experience.isCurrentJob ? 'Saat ini' : ''}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`current-${experience.id}`}
                                checked={experience.isCurrentJob}
                                onChange={(e) => {
                                  updateWorkExperience(experience.id, 'isCurrentJob', e.target.checked);
                                  if (e.target.checked) {
                                    updateWorkExperience(experience.id, 'endDate', '');
                                  }
                                }}
                                className="rounded"
                              />
                              <Label htmlFor={`current-${experience.id}`} className="text-sm">
                                Saya masih bekerja di sini
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Deskripsi Pekerjaan</Label>
                            <Textarea
                              rows={4}
                              value={experience.description}
                              onChange={(e) => updateWorkExperience(experience.id, 'description', e.target.value)}
                              placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                              className="resize-none"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => generateJobDescriptionWithAI(experience.id)}
                              className="w-full"
                            >
                              <Sparkles className="mr-2" size={16} />
                              Bantu Tulis Deskripsi Pekerjaan dengan AI 🚀
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Education */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <GraduationCap className="text-primary" size={20} />
                    <h2 className="text-xl font-semibold">Pendidikan</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution">Nama Institusi *</Label>
                      <Input
                        id="institution"
                        value={cvData.education.institution}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          education: { ...prev.education, institution: e.target.value }
                        }))}
                        placeholder="cth: Universitas Indonesia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">Jurusan *</Label>
                      <Input
                        id="major"
                        value={cvData.education.major}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          education: { ...prev.education, major: e.target.value }
                        }))}
                        placeholder="cth: Teknik Informatika"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Tahun Lulus *</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        min="1980"
                        max="2030"
                        value={cvData.education.graduationYear}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          education: { ...prev.education, graduationYear: e.target.value }
                        }))}
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gpa">IPK (Opsional)</Label>
                      <Input
                        id="gpa"
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={cvData.education.gpa}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          education: { ...prev.education, gpa: e.target.value }
                        }))}
                        placeholder="3.75"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Skills */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="text-primary" size={20} />
                    <h2 className="text-xl font-semibold">Keahlian</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="skillInput">Tambahkan Keahlian</Label>
                      <Input
                        id="skillInput"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={addSkill}
                        placeholder="Ketik keahlian dan tekan Enter (cth: JavaScript, React, Photoshop)"
                      />
                      <p className="text-sm text-muted-foreground">
                        Tekan Enter untuk menambahkan keahlian
                      </p>
                    </div>

                    {cvData.skills.length > 0 && (
                      <div className="space-y-2">
                        <Label>Keahlian yang Ditambahkan</Label>
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              onClick={() => removeSkill(skill)}
                            >
                              {skill}
                              <Trash2 size={12} className="ml-2" />
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Klik pada badge untuk menghapus keahlian
                        </p>
                      </div>
                    )}

                    {/* Template Selection */}
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

                    {/* Download Section */}
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
                      >
                        <Download size={20} className="mr-2" />
                        Download CV sebagai PDF
                      </Button>
                    </div>
                  </div>
                </div>
              )}

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
            <Card className="p-6 shadow-medium min-h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Preview CV</h3>
                <Button size="sm" variant="outline" onClick={downloadPDF}>
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </div>
              
              <Separator className="mb-6" />
              
              {/* CV Preview Content */}
              <div className="space-y-6 text-sm">
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

                {/* Work Experience Section */}
                {cvData.workExperience.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-primary mb-3">PENGALAMAN KERJA</h2>
                    <div className="space-y-4">
                      {cvData.workExperience.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-primary/20 pl-4">
                          <h3 className="font-medium">{exp.position || 'Posisi Pekerjaan'}</h3>
                          <p className="text-primary text-sm font-medium">
                            {exp.company || 'Nama Perusahaan'}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {exp.startDate && (
                              <>
                                {new Date(exp.startDate + '-01').toLocaleDateString('id-ID', { 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                                {' - '}
                                {exp.isCurrentJob || !exp.endDate 
                                  ? 'Sekarang' 
                                  : new Date(exp.endDate + '-01').toLocaleDateString('id-ID', { 
                                      month: 'long', 
                                      year: 'numeric' 
                                    })
                                }
                              </>
                            )}
                          </p>
                          {exp.description && (
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Section */}
                {(cvData.education.institution || cvData.education.major) && (
                  <div>
                    <h2 className="font-semibold text-primary mb-2">PENDIDIKAN</h2>
                    <div>
                      <h3 className="font-medium">
                        {cvData.education.major || 'Jurusan'} 
                        {cvData.education.gpa && ` - IPK ${cvData.education.gpa}`}
                      </h3>
                      <p className="text-primary text-sm">
                        {cvData.education.institution || 'Nama Institusi'}
                      </p>
                      {cvData.education.graduationYear && (
                        <p className="text-xs text-muted-foreground">
                          Lulus tahun {cvData.education.graduationYear}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {cvData.skills.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-primary mb-2">KEAHLIAN</h2>
                    <div className="flex flex-wrap gap-1">
                      {cvData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Template info */}
                <div className="mt-8 pt-4 border-t border-muted text-center">
                  <p className="text-xs text-muted-foreground">
                    Template: {templates.find(t => t.id === selectedTemplate)?.name}
                  </p>
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