import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Info, TrendingUp, Target, BookOpen, Zap, Edit3, ArrowRight } from 'lucide-react';
import { parseDocxFile, parsePdfFile, analyzeCV, ATSAnalysis } from '../lib/cv-analyzer';
import { parseCVToResume, mergeCVWithResume } from '../lib/cv-parser';
import type { ResumeData } from '../lib/types';

export function CVAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [parsedResume, setParsedResume] = useState<Partial<ResumeData> | null>(null);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  
  // Function to import parsed resume into builder
  const importToBuilder = useCallback(() => {
    if (!parsedResume) return;
    
    // Get existing resume from localStorage or create new one
    const existingResumeStr = localStorage.getItem('rb_resume_v1');
    const existingResume: ResumeData | null = existingResumeStr ? JSON.parse(existingResumeStr) : null;
    
    // Create empty resume as fallback
    const emptyResume: ResumeData = {
      id: Math.random().toString(36).slice(2, 10),
      roleSlug: null,
      contact: { fullName: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '' },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      template: 'merit',
      accent: '#17594a'
    };
    
    // Merge parsed data with existing or empty resume
    const merged = mergeCVWithResume(parsedResume, existingResume || emptyResume);
    
    // Save to localStorage
    localStorage.setItem('rb_resume_v1', JSON.stringify(merged));
    
    // Show success message
    setShowImportSuccess(true);
    setTimeout(() => setShowImportSuccess(false), 5000);
    
    // Redirect to builder
    window.location.href = '/builder';
  }, [parsedResume]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'application/msword'
    ];
    
    if (!validTypes.includes(uploadedFile.type) && !uploadedFile.name.endsWith('.docx') && !uploadedFile.name.endsWith('.pdf')) {
      setError('Please upload a DOCX or PDF file');
      return;
    }

    setFile(uploadedFile);
    setError(null);
    setAnalysis(null);
    setParsedResume(null);
    setIsAnalyzing(true);

    try {
      let text = '';
      
      if (uploadedFile.name.endsWith('.docx')) {
        const result = await parseDocxFile(uploadedFile);
        text = result.text;
      } else if (uploadedFile.name.endsWith('.pdf')) {
        const result = await parsePdfFile(uploadedFile);
        text = result.text;
      } else {
        throw new Error('Unsupported file format');
      }

      // Parse CV into structured resume data
      const parsed = parseCVToResume(text);
      setParsedResume(parsed);
      
      // Analyze the CV
      const result = analyzeCV(text, jobDescription || undefined);
      result.formatting.fileFormat = uploadedFile.name.endsWith('.docx') ? 'docx' : 'pdf';
      
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze CV');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription]);

  const reanalyzeWithJobDescription = () => {
    if (!file || !analysis) return;
    
    setIsAnalyzing(true);
    try {
      // Re-parse and analyze with job description
      const analyzeAgain = async () => {
        let text = '';
        
        if (file.name.endsWith('.docx')) {
          const result = await parseDocxFile(file);
          text = result.text;
        } else {
          const result = await parsePdfFile(file);
          text = result.text;
        }

        const result = analyzeCV(text, jobDescription || undefined);
        result.formatting.fileFormat = file.name.endsWith('.docx') ? 'docx' : 'pdf';
        setAnalysis(result);
      };
      
      analyzeAgain();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">ATS Resume Checker</h1>
        <p className="text-gray-600">
          Upload your resume to get instant feedback on ATS compatibility, keywords, and improvements
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <label
              htmlFor="cv-upload"
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">DOCX or PDF (MAX. 10MB)</p>
              </div>
              <input
                id="cv-upload"
                type="file"
                className="hidden"
                accept=".docx,.pdf,.doc"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
            </label>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {file && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                {isAnalyzing && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Description Input */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Optional: Job Description
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Paste the job description to get tailored keyword suggestions and match scoring
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        {jobDescription && analysis && (
          <button
            onClick={reanalyzeWithJobDescription}
            className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Re-analyze with Job Description
          </button>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">ATS Score</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold">{analysis.score}</span>
                  <span className="text-xl">/ {analysis.maxScore}</span>
                  <span className={`px-3 py-1 rounded-full text-lg font-bold ${getGradeColor(analysis.grade)} text-gray-900`}>
                    Grade {analysis.grade}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <TrendingUp className="w-16 h-16 opacity-30" />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Sections Found</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(analysis.sections)
                  .filter(([key]) => key !== 'missing')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      {value.exists ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Keywords</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysis.keywords.slice(0, 10).map((kw, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{kw.keyword}</span>
                    {kw.found ? (
                      <span className="text-green-600 font-medium">✓ ({kw.count})</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Formatting</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>File Format</span>
                  <span className="font-medium uppercase">{analysis.formatting.fileFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span>ATS Readable</span>
                  {analysis.formatting.readableByATS ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Has Tables</span>
                  {analysis.formatting.hasTables ? (
                    <span className="text-yellow-600">Yes (⚠️)</span>
                  ) : (
                    <span className="text-green-600">No</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Parsable</span>
                  {analysis.formatting.isParseable ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Top Recommendations
              </h3>
              <ul className="space-y-3">
                {analysis.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Issues */}
          {analysis.issues.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Analysis</h3>
              <div className="space-y-3">
                {analysis.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      issue.type === 'critical'
                        ? 'bg-red-50 border-red-500'
                        : issue.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{issue.message}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            issue.type === 'critical'
                              ? 'bg-red-200 text-red-800'
                              : issue.type === 'warning'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-blue-200 text-blue-800'
                          }`}>
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{issue.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Keyword Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.keywords.filter(k => k.found).length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Found Keywords ({analysis.keywords.filter(k => k.found).length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords
                      .filter(k => k.found)
                      .slice(0, 15)
                      .map((kw, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-sm ${
                            kw.importance === 'high'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {kw.keyword} {kw.count > 1 && `(${kw.count})`}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              
              {analysis.keywords.filter(k => !k.found).length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Missing Keywords ({analysis.keywords.filter(k => !k.found).length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords
                      .filter(k => !k.found)
                      .slice(0, 15)
                      .map((kw, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-sm ${
                            kw.importance === 'high'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {kw.keyword}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Want to improve your score?</h3>
            <p className="text-gray-600 mb-4">
              Use our professional resume builder to create an ATS-optimized resume with perfect formatting
            </p>
            {parsedResume ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg inline-block">
                  <CheckCircle className="w-4 h-4" />
                  <span>Resume data extracted successfully!</span>
                </div>
                <br/>
                <button
                  onClick={importToBuilder}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                  Import & Edit in Builder
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <a href="/builder" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Go to Resume Builder
              </a>
            )}
          </div>
          
          {/* Success Toast */}
          {showImportSuccess && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Resume imported successfully!</p>
                <p className="text-sm text-green-100">Redirecting to builder...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!analysis && !file && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <div className="max-w-md mx-auto">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">How It Works</h3>
            <div className="space-y-4 text-left mt-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium">Upload Your Resume</h4>
                  <p className="text-sm text-gray-600">Supports DOCX and PDF formats</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium">Optional: Add Job Description</h4>
                  <p className="text-sm text-gray-600">Get tailored keyword matching</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium">Get Instant Feedback</h4>
                  <p className="text-sm text-gray-600">Receive ATS score, issues, and actionable suggestions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
