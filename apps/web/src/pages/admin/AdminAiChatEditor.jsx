import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { adminApi } from '../../lib/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CloudinaryUploadWidget from '../../components/admin/CloudinaryUploadWidget';
import { FiSave } from 'react-icons/fi';
import './AdminProjectEditor.css';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// Simple Markdown parser for AI responses
const parseMarkdown = (text) => {
    if (!text) return '';
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color: var(--accent-primary); text-decoration: underline;">$1</a>')
        .replace(/(^|\s)(https?:\/\/\S+|www\.\S+)/g, (match, space, url) => {
            const cleanUrl = url.replace(/[.,!?;]+$/, '');
            const href = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
            const punctuation = url.substring(cleanUrl.length);
            return `${space}<a href="${href}" target="_blank" rel="noreferrer" style="color: var(--accent-primary); text-decoration: underline;">${cleanUrl}</a>${punctuation}`;
        })
        .replace(/^\s*[-*]\s+(.*)$/gm, '&bull; $1')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br />');
    return `<p>${html}</p>`;
};

// Helper to determine if an avatar URL is a Lottie animation
const isLottie = (url) => {
    if (!url) return false;
    return url.endsWith('.lottie') || url.endsWith('.json') || url.includes('lottie.host');
};

export default function AdminAiChatEditor() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('logs');
    const [logsData, setLogsData] = useState({ logs: [], stats: {} });
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [expandedLogs, setExpandedLogs] = useState({});
    const [uploadingFile, setUploadingFile] = useState(false);
    const [timeRange, setTimeRange] = useState('daily');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedSessions, setSelectedSessions] = useState([]);

    const fetchLogs = useCallback(() => {
        setLoadingLogs(true);
        adminApi.getAiChatLogs()
            .then(data => setLogsData(data))
            .catch(console.error)
            .finally(() => setLoadingLogs(false));
    }, []);

    const groupedLogs = useMemo(() => {
        if (!logsData.logs) return [];
        
        let filtered = logsData.logs;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (dateFilter) {
            filtered = filtered.filter(log => new Date(log.createdAt).toISOString().split('T')[0] === dateFilter);
        } else if (timeRange === 'daily') {
            filtered = filtered.filter(log => new Date(log.createdAt) >= today);
        } else if (timeRange === 'weekly') {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            filtered = filtered.filter(log => new Date(log.createdAt) >= weekAgo);
        } else if (timeRange === 'monthly') {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filtered = filtered.filter(log => new Date(log.createdAt) >= monthAgo);
        } else if (timeRange === 'yearly') {
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            filtered = filtered.filter(log => new Date(log.createdAt) >= yearAgo);
        }

        const sessions = [];
        let currentSession = null;
        
        // Logs are already sorted DESC from API (newest first). 
        // We reverse them to ASC (oldest first) to build sessions chronologically, 
        // which avoids expensive O(N log N) sorting and Date parsing.
        const sorted = [...filtered].reverse();

        sorted.forEach(log => {
            if (!currentSession) {
                currentSession = {
                    id: log.sessionId || `session-${log.id}`,
                    location: log.location,
                    startTime: log.createdAt,
                    endTime: log.createdAt,
                    logs: [log]
                };
                sessions.push(currentSession);
            } else {
                const timeDiff = new Date(log.createdAt).getTime() - new Date(currentSession.endTime).getTime();
                const isSameSessionId = log.sessionId && currentSession.logs[0].sessionId === log.sessionId;
                const isSameLocationAndTime = !log.sessionId && currentSession.location === log.location && timeDiff <= 30 * 60 * 1000;
                
                if (isSameSessionId || isSameLocationAndTime) {
                    currentSession.logs.push(log);
                    currentSession.endTime = log.createdAt;
                } else {
                    currentSession = {
                        id: log.sessionId || `session-${log.id}`,
                        location: log.location,
                        startTime: log.createdAt,
                        endTime: log.createdAt,
                        logs: [log]
                    };
                    sessions.push(currentSession);
                }
            }
        });

        return sessions.reverse(); // Reverse back to DESC (newest sessions first)
    }, [logsData.logs, timeRange, dateFilter]);

    useEffect(() => {
        if (activeTab === 'logs') {
            fetchLogs();
        }
    }, [activeTab, fetchLogs]);

    const toggleLogExpand = (id) => {
        setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteSession = async (sessionId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this session and all its messages? This action cannot be undone.')) {
            try {
                await adminApi.deleteAiChatSession(sessionId);
                setSelectedSessions(prev => prev.filter(id => id !== sessionId));
                fetchLogs(); // Refresh logs after deletion
            } catch (err) {
                alert('Failed to delete session: ' + err.message);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedSessions.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedSessions.length} selected sessions? This action cannot be undone.`)) {
            try {
                await adminApi.deleteAiChatSessionsBulk(selectedSessions);
                setSelectedSessions([]);
                fetchLogs(); // Refresh logs after deletion
            } catch (err) {
                alert('Failed to delete selected sessions: ' + err.message);
            }
        }
    };

    const toggleSelectSession = (sessionId, e) => {
        e.stopPropagation();
        setSelectedSessions(prev => 
            prev.includes(sessionId) 
                ? prev.filter(id => id !== sessionId) 
                : [...prev, sessionId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSessions(groupedLogs.map(s => s.id));
        } else {
            setSelectedSessions([]);
        }
    };
    
    const [showApiKey, setShowApiKey] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        adminApi.getAiChat()
            .then((data) => {
                if (data) {
                    // parse models and suggestions if they are strings
                    let parsedModels = [];
                    let parsedSuggestions = [];
                    try {
                        parsedModels = typeof data.groqModels === 'string' ? JSON.parse(data.groqModels) : data.groqModels;
                    } catch (e) { parsedModels = ['llama-3.3-70b-versatile']; }
                    
                    try {
                        parsedSuggestions = typeof data.suggestions === 'string' ? JSON.parse(data.suggestions) : data.suggestions;
                    } catch (e) { parsedSuggestions = []; }

                    setSettings({
                        ...data,
                        groqModels: parsedModels,
                        suggestions: parsedSuggestions,
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await adminApi.updateAiChat(settings);
            setMessage('✅ Saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('❌ Failed to save: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploadingFile(true);
        try {
            let text = '';
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str);
                    text += strings.join(' ') + '\n';
                }
            } else {
                text = await file.text();
            }
            
            if (text) {
                const currentPrompt = settings?.knowledgeBase || '';
                const newPrompt = currentPrompt ? currentPrompt + '\n\n' + text.trim() : text.trim();
                handleUpdate('knowledgeBase', newPrompt);
                setMessage('✅ File content extracted and added!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            setMessage('❌ Failed to parse file: ' + err.message);
        } finally {
            setUploadingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = null;
        }
    };

    const handleUpdate = useCallback((field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleAvatarUpload = useCallback((url) => {
        handleUpdate('assistantAvatarUrl', url);
    }, [handleUpdate]);

    const avatarPreview = useMemo(() => {
        if (!settings?.assistantAvatarUrl) return null;
        return isLottie(settings.assistantAvatarUrl) ? (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                <dotlottie-wc 
                    src={settings.assistantAvatarUrl} 
                    style={{ width: '100%', height: '100%' }} 
                    autoplay 
                    loop 
                />
            </div>
        ) : (
            <img src={settings.assistantAvatarUrl} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
        );
    }, [settings?.assistantAvatarUrl]);

    const handleSuggestionChange = (index, field, value) => {
        const newSuggestions = [...settings.suggestions];
        newSuggestions[index] = { ...newSuggestions[index], [field]: value };
        handleUpdate('suggestions', newSuggestions);
    };

    const addSuggestion = () => {
        const newSuggestions = [...(settings.suggestions || []), { icon: '✨', label: 'New', prompt: '' }];
        handleUpdate('suggestions', newSuggestions);
    };

    const removeSuggestion = (index) => {
        const newSuggestions = settings.suggestions.filter((_, i) => i !== index);
        handleUpdate('suggestions', newSuggestions);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-project-editor">
            <div className="admin-page-header">
                <div>
                    <h2 className="page-heading">Pengaturan AI Assistant Chat</h2>
                    <p className="page-subheading">Kelola konfigurasi model Groq, basis pengetahuan sistem, dan riwayat obrolan pengunjung.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {message && <span style={{ fontSize: '0.88rem', fontWeight: 600, color: message.startsWith('✅') ? '#059669' : '#dc2626' }}>{message}</span>}
                    <button 
                        className="btn-cms btn-cms-primary" 
                        onClick={handleSave} 
                        disabled={saving}
                    >
                        <FiSave size={16} />
                        <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
                <button 
                    style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: activeTab === 'logs' ? 'bold' : 'normal', color: activeTab === 'logs' ? 'var(--accent-primary)' : 'var(--text-primary)', cursor: 'pointer', borderBottom: activeTab === 'logs' ? '2px solid var(--accent-primary)' : 'none', padding: '0 8px 8px 8px', marginBottom: '-13px' }}
                    onClick={() => setActiveTab('logs')}
                >
                    📊 Analitik & Riwayat
                </button>
                <button 
                    style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: activeTab === 'settings' ? 'bold' : 'normal', color: activeTab === 'settings' ? 'var(--accent-primary)' : 'var(--text-primary)', cursor: 'pointer', borderBottom: activeTab === 'settings' ? '2px solid var(--accent-primary)' : 'none', padding: '0 8px 8px 8px', marginBottom: '-13px' }}
                    onClick={() => setActiveTab('settings')}
                >
                    ⚙️ Pengaturan AI
                </button>
            </div>

            {activeTab === 'settings' ? (
                <div className="editor-grid">
                    <div className="editor-panel animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h4 className="panel-title" style={{ margin: 0 }}>Groq Configuration</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{settings?.isEnabled ? 'Enabled' : 'Disabled'}</span>
                                <button 
                                    className="toggle-btn"
                                    style={{
                                        background: settings?.isEnabled ? 'var(--accent-primary)' : 'var(--nav-border)',
                                        border: 'none',
                                        borderRadius: '16px',
                                        width: '40px',
                                        height: '24px',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        transition: 'background 0.3s'
                                    }}
                                    onClick={() => handleUpdate('isEnabled', !settings?.isEnabled)}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: settings?.isEnabled ? '18px' : '2px',
                                        width: '20px',
                                        height: '20px',
                                        background: 'white',
                                        borderRadius: '50%',
                                        transition: 'left 0.3s'
                                    }} />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Groq API Key</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type={showApiKey ? "text" : "password"} 
                                    className="form-input" 
                                    value={settings?.groqApiKey || ''} 
                                    onChange={(e) => handleUpdate('groqApiKey', e.target.value)} 
                                    placeholder="gsk_..." 
                                />
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    type="button"
                                >
                                    {showApiKey ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <span className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Get your free API key at console.groq.com/keys</span>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Sifat & Peran AI (Persona) - English</label>
                            <textarea 
                                className="form-input" 
                                rows="6" 
                                value={settings?.personaPrompt || ''} 
                                onChange={(e) => handleUpdate('personaPrompt', e.target.value)} 
                                placeholder="You are a loyal virtual assistant..."
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Sifat & Peran AI (Persona) - Indonesia</label>
                            <textarea 
                                className="form-input" 
                                rows="6" 
                                value={settings?.personaPromptId || ''} 
                                onChange={(e) => handleUpdate('personaPromptId', e.target.value)} 
                                placeholder="Kamu adalah asisten virtual yang setia..."
                            />
                            <span className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Tentukan sifat, peran, dan cara AI menjawab (contoh: galak, ramah, loyal, dll).</span>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ margin: 0 }}>Data Pengetahuan (Portofolio) - English</label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {uploadingFile && <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Extracting text...</span>}
                                    <button 
                                        type="button"
                                        className="btn-secondary" 
                                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingFile}
                                    >
                                        Upload CV / PDF
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }} 
                                        accept=".pdf,.txt,.md" 
                                        onChange={handleFileUpload} 
                                    />
                                </div>
                            </div>
                            <textarea 
                                className="form-input" 
                                rows="8" 
                                value={settings?.knowledgeBase || ''} 
                                onChange={(e) => handleUpdate('knowledgeBase', e.target.value)} 
                                placeholder="Here is the data about your boss..."
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Data Pengetahuan (Portofolio) - Indonesia</label>
                            <textarea 
                                className="form-input" 
                                rows="8" 
                                value={settings?.knowledgeBaseId || ''} 
                                onChange={(e) => handleUpdate('knowledgeBaseId', e.target.value)} 
                                placeholder="Berikut adalah data tentang bosmu..."
                            />
                            <span className="text-secondary" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Masukkan data portofolio, pengalaman kerja, kontak, dll. AI akan membaca data ini untuk menjawab pertanyaan teknis.</span>
                        </div>
                    </div>

                    <div className="editor-panel animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <h4 className="panel-title">Display & Content</h4>

                        <div className="form-group">
                            <label>Assistant Name</label>
                            <input type="text" className="form-input" value={settings?.assistantName || ''} onChange={(e) => handleUpdate('assistantName', e.target.value)} />
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Avatar URL</label>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                {avatarPreview}
                                <div style={{ flex: 1 }}>
                                    <input type="text" className="form-input" value={settings?.assistantAvatarUrl || ''} onChange={(e) => handleUpdate('assistantAvatarUrl', e.target.value)} placeholder="/images/bodal-avatar.png" />
                                </div>
                                <CloudinaryUploadWidget 
                                    onUploadSuccess={handleAvatarUpload} 
                                    buttonText="Upload Avatar"
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Welcome Title</label>
                            <input type="text" className="form-input" value={settings?.welcomeTitle || ''} onChange={(e) => handleUpdate('welcomeTitle', e.target.value)} />
                        </div>

                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Welcome Subtitle</label>
                            <input type="text" className="form-input" value={settings?.welcomeSubtitle || ''} onChange={(e) => handleUpdate('welcomeSubtitle', e.target.value)} />
                        </div>
                    </div>

                    <div className="editor-panel animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h4 className="panel-title" style={{ margin: 0 }}>Chat Suggestions</h4>
                            <button className="btn-secondary" onClick={addSuggestion} type="button">+ Add</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(settings?.suggestions || []).map((sugg, idx) => (
                                <div key={`sugg-${idx}`} style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--nav-border)' }}>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ width: '60px' }} 
                                        placeholder="Icon" 
                                        value={sugg.icon || ''} 
                                        onChange={(e) => handleSuggestionChange(idx, 'icon', e.target.value)} 
                                    />
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ width: '120px' }} 
                                        placeholder="Label" 
                                        value={sugg.label || ''} 
                                        onChange={(e) => handleSuggestionChange(idx, 'label', e.target.value)} 
                                    />
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ flex: 1 }} 
                                        placeholder="Prompt text..." 
                                        value={sugg.prompt || ''} 
                                        onChange={(e) => handleSuggestionChange(idx, 'prompt', e.target.value)} 
                                    />
                                    <button className="btn-secondary" style={{ color: '#ff3b30' }} onClick={() => removeSuggestion(idx)} type="button">X</button>
                                </div>
                            ))}
                            {(!settings?.suggestions || settings.suggestions.length === 0) && (
                                <p className="text-secondary text-center" style={{ padding: '20px' }}>No suggestions added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="logs-dashboard animate-fade-in">
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div className="stat-card" style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)', flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>Sesi Hari Ini</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{logsData.stats.todayChats || 0}</div>
                        </div>
                        <div className="stat-card" style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)', flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>Sesi Minggu Ini</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{logsData.stats.weekChats || 0}</div>
                        </div>
                        <div className="stat-card" style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)', flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>Sesi Bulan Ini</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{logsData.stats.monthChats || 0}</div>
                        </div>
                        <div className="stat-card" style={{ padding: '16px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)', flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)' }}>Total Sesi</h4>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{logsData.stats.totalChats || 0}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <h3 style={{ margin: 0 }}>Riwayat Percakapan</h3>
                            
                            {/* Segmented Control for Time Range Filter */}
                            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
                                {['daily', 'weekly', 'monthly', 'yearly', 'all'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => { setTimeRange(range); setDateFilter(''); }}
                                        style={{
                                            padding: '6px 16px',
                                            border: 'none',
                                            background: (timeRange === range && !dateFilter) ? 'var(--bg-primary)' : 'transparent',
                                            color: (timeRange === range && !dateFilter) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            borderRadius: 'var(--radius-sm)',
                                            cursor: 'pointer',
                                            fontWeight: (timeRange === range && !dateFilter) ? '500' : 'normal',
                                            boxShadow: (timeRange === range && !dateFilter) ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.2s',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                            
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginLeft: '16px' }}>
                                <input type="checkbox" checked={selectedSessions.length === groupedLogs.length && groupedLogs.length > 0} onChange={handleSelectAll} />
                                <span>Select All</span>
                            </label>

                            {selectedSessions.length > 0 && (
                                <button 
                                    className="btn-secondary" 
                                    style={{ padding: '6px 16px', color: '#ff3b30', borderColor: '#ff3b3033', marginLeft: 'auto' }}
                                    onClick={handleBulkDelete}
                                >
                                    Hapus Terpilih ({selectedSessions.length})
                                </button>
                            )}
                        </div>

                        <input 
                            type="date" 
                            className="form-input" 
                            style={{ width: 'auto', padding: '6px 12px' }} 
                            value={dateFilter} 
                            onChange={e => { setDateFilter(e.target.value); setTimeRange('daily'); }} 
                            title="Filter Tanggal"
                        />
                    </div>
                    {loadingLogs ? (
                        <LoadingSpinner />
                    ) : groupedLogs.length === 0 ? (
                        <p className="text-secondary">Belum ada percakapan dengan AI pada kriteria ini.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {groupedLogs.map((session, idx) => {
                                const isExpanded = expandedLogs[session.id];
                                return (
                                    <div key={session.id} style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--card-border)', overflow: 'hidden' }}>
                                        <div 
                                            style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}
                                            onClick={() => toggleLogExpand(session.id)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedSessions.includes(session.id)} 
                                                    onChange={(e) => toggleSelectSession(session.id, e)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                />
                                                <strong>{new Date(session.startTime).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }).replace(/\./g, ':')}</strong>
                                                <span>- {session.location || 'Unknown'} </span>
                                                <span className="text-secondary" style={{ fontSize: '0.9rem' }}>({String(groupedLogs.length - idx).padStart(4, '0')})</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <span className="text-secondary" style={{ fontSize: '0.9rem', background: 'var(--nav-border)', padding: '2px 8px', borderRadius: '12px' }}>{session.logs.length} Pesan</span>
                                                <button 
                                                    className="btn-secondary" 
                                                    style={{ padding: '4px 8px', color: '#ff3b30', borderColor: '#ff3b3033' }}
                                                    onClick={(e) => handleDeleteSession(session.id, e)}
                                                    title="Delete Session"
                                                >
                                                    Hapus
                                                </button>
                                                <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                            </div>
                                        </div>
                                        
                                        {isExpanded && (
                                            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', background: 'var(--bg-primary)' }}>
                                                {session.logs.map(log => (
                                                    <div key={log.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                        <div style={{ alignSelf: 'flex-end', background: 'var(--accent-primary)', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 0 16px', maxWidth: '85%' }}>
                                                            {log.prompt}
                                                        </div>
                                                        <div style={{ alignSelf: 'flex-start', background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: '16px 16px 16px 0', maxWidth: '85%', border: '1px solid var(--card-border)' }}>
                                                            <div dangerouslySetInnerHTML={{ __html: parseMarkdown(log.response) }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
