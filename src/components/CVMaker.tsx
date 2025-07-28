import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Linkedin
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
}

interface Education {
  institution: string;
  major: string;
  graduationYear: string;
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
      graduationYear: ''
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
        description: ''
      }]
    }));
  };

  const removeWorkExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
  };

  const updateWorkExperience = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !cvData.skills.includes(skill.trim())) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
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
                    <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                      <Camera className="text-primary" size={24} />
                    </div>
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
                    <User className="text-primary" size={20} />
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
                    <Button variant="outline" className="w-full">
                      <Sparkles className="mr-2" size={16} />
                      Buatkan Ringkasan dengan AI ✨
                    </Button>
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
                <Button size="sm" variant="outline">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </div>
              
              <Separator className="mb-6" />
              
              {/* CV Preview Content */}
              <div className="space-y-6 text-sm">
                {/* Header Section */}
                <div className="text-center border-b pb-4">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                    <User className="text-muted-foreground" size={24} />
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

                {/* Placeholder sections for other steps */}
                <div className="space-y-4">
                  <div>
                    <h2 className="font-semibold text-primary mb-2">PENGALAMAN KERJA</h2>
                    <p className="text-muted-foreground text-xs italic">
                      Pengalaman kerja akan muncul di sini...
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-primary mb-2">PENDIDIKAN</h2>
                    <p className="text-muted-foreground text-xs italic">
                      Informasi pendidikan akan muncul di sini...
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="font-semibold text-primary mb-2">KEAHLIAN</h2>
                    <p className="text-muted-foreground text-xs italic">
                      Daftar keahlian akan muncul di sini...
                    </p>
                  </div>
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