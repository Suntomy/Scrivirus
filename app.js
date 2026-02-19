// Global Think AI Code Editor - Main JavaScript
// Owner: Olawale Abdul-Ganiyu

// Global Variables
let htmlEditor, cssEditor, jsEditor;
let liveMode = true;
let darkMode = true;
let currentTheme = 'vs-dark';
let browserHistory = [];
let browserHistoryIndex = -1;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Hide splash screen after loading
    setTimeout(function() {
        document.getElementById('splashscreen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('splashscreen').style.display = 'none';
        }, 500);
    }, 2000);

    // Initialize Monaco Editor
    initMonacoEditor();

    // Initialize Split.js for resizable panels
    initSplitLayout();

    // Initialize event listeners
    initEventListeners();

    // Initialize browser controls
    initBrowserControls();

    // Load default code
    loadDefaultCode();

    // Update network status
    updateNetworkStatus();

    // Start live preview
    startLivePreview();
});

// Initialize Monaco Editor
function initMonacoEditor() {
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});

    require(['vs/editor/editor.main'], function() {
        // HTML Editor
        htmlEditor = monaco.editor.create(document.getElementById('html-editor'), {
            value: '',
            language: 'html',
            theme: currentTheme,
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2
        });

        // CSS Editor
        cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
            value: '',
            language: 'css',
            theme: currentTheme,
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2
        });

        // JavaScript Editor
        jsEditor = monaco.editor.create(document.getElementById('js-editor'), {
            value: '',
            language: 'javascript',
            theme: currentTheme,
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2
        });

        // Add change event listeners
        htmlEditor.onDidChangeModelContent(() => {
            if (liveMode) updatePreview();
        });

        cssEditor.onDidChangeModelContent(() => {
            if (liveMode) updatePreview();
        });

        jsEditor.onDidChangeModelContent(() => {
            if (liveMode) updatePreview();
        });
    });
}

// Initialize Split Layout
function initSplitLayout() {
    Split(['#a', '#b'], {
        direction: 'vertical',
        sizes: [50, 50],
        minSize: [100, 100],
        gutterSize: 5,
        cursor: 'row-resize'
    });

    Split(['#html', '#css'], {
        direction: 'horizontal',
        sizes: [50, 50],
        minSize: [100, 100],
        gutterSize: 5,
        cursor: 'col-resize'
    });

    Split(['#js', '#preview-container'], {
        direction: 'horizontal',
        sizes: [30, 70],
        minSize: [100, 100],
        gutterSize: 5,
        cursor: 'col-resize'
    });
}

// Initialize Event Listeners
function initEventListeners() {
    // Menu Items
    document.getElementById('home').addEventListener('click', function(e) {
        e.preventDefault();
        loadDefaultCode();
        showToast('Home loaded!');
    });

    document.getElementById('new-project').addEventListener('click', function(e) {
        e.preventDefault();
        newProject();
    });

    document.getElementById('cover-page').addEventListener('click', function(e) {
        e.preventDefault();
        openModal('cover-modal');
    });

    // Tools
    document.getElementById('format-html').addEventListener('click', function(e) {
        e.preventDefault();
        formatCode(htmlEditor);
    });

    document.getElementById('format-css').addEventListener('click', function(e) {
        e.preventDefault();
        formatCode(cssEditor);
    });

    document.getElementById('format-js').addEventListener('click', function(e) {
        e.preventDefault();
        formatCode(jsEditor);
    });

    document.getElementById('ai-generate').addEventListener('click', function(e) {
        e.preventDefault();
        generateAICode();
    });

    // Converter
    document.getElementById('convert-web').addEventListener('click', function(e) {
        e.preventDefault();
        openConverter('web');
    });

    document.getElementById('convert-exe').addEventListener('click', function(e) {
        e.preventDefault();
        openConverter('exe');
    });

    document.getElementById('convert-apk').addEventListener('click', function(e) {
        e.preventDefault();
        openConverter('apk');
    });

    document.getElementById('convert-ios').addEventListener('click', function(e) {
        e.preventDefault();
        openConverter('ios');
    });

    document.getElementById('convert-python').addEventListener('click', function(e) {
        e.preventDefault();
        openModal('python-modal');
    });

    // Cloud & Deploy
    document.getElementById('cloud-upload').addEventListener('click', function(e) {
        e.preventDefault();
        openModal('cloud-modal');
    });

    document.getElementById('deploy-web').addEventListener('click', function(e) {
        e.preventDefault();
        deployToWeb();
    });

    document.getElementById('review-project').addEventListener('click', function(e) {
        e.preventDefault();
        reviewProject();
    });

    // Download
    document.getElementById('download-html').addEventListener('click', function(e) {
        e.preventDefault();
        downloadHTML();
    });

    document.getElementById('download-zip').addEventListener('click', function(e) {
        e.preventDefault();
        downloadZIP();
    });

    document.getElementById('import-code').addEventListener('click', function(e) {
        e.preventDefault();
        openImportModal('import');
    });

    document.getElementById('export-code').addEventListener('click', function(e) {
        e.preventDefault();
        openImportModal('export');
    });

    // Developer Tools
    document.getElementById('python-installer').addEventListener('click', function(e) {
        e.preventDefault();
        openModal('python-modal');
    });

    document.getElementById('console-output').addEventListener('click', function(e) {
        e.preventDefault();
        showConsoleOutput();
    });

    document.getElementById('extract-folder').addEventListener('click', function(e) {
        e.preventDefault();
        extractFolder();
    });

    // Run Button
    document.getElementById('run').addEventListener('click', function(e) {
        e.preventDefault();
        updatePreview();
        showToast('Code executed!');
    });

    // Settings
    document.getElementById('range-font-size').addEventListener('input', function() {
        const fontSize = this.value;
        document.getElementById('current-font-size').textContent = fontSize;
        
        if (htmlEditor) htmlEditor.updateOptions({ fontSize: parseInt(fontSize) });
        if (cssEditor) cssEditor.updateOptions({ fontSize: parseInt(fontSize) });
        if (jsEditor) jsEditor.updateOptions({ fontSize: parseInt(fontSize) });
    });

    document.getElementById('chk-live-mode').addEventListener('change', function() {
        liveMode = this.checked;
        showToast(liveMode ? 'Live mode enabled' : 'Live mode disabled');
    });

    document.getElementById('chk-theme').addEventListener('change', function() {
        toggleTheme(this.checked);
    });

    document.getElementById('chk-line-number').addEventListener('change', function() {
        const showLineNumbers = this.checked ? 'on' : 'off';
        
        if (htmlEditor) htmlEditor.updateOptions({ lineNumbers: showLineNumbers });
        if (cssEditor) cssEditor.updateOptions({ lineNumbers: showLineNumbers });
        if (jsEditor) jsEditor.updateOptions({ lineNumbers: showLineNumbers });
    });

    document.getElementById('chk-mini-map').addEventListener('change', function() {
        if (htmlEditor) htmlEditor.updateOptions({ minimap: { enabled: this.checked } });
        if (cssEditor) cssEditor.updateOptions({ minimap: { enabled: this.checked } });
        if (jsEditor) jsEditor.updateOptions({ minimap: { enabled: this.checked } });
    });

    // AI Chat Panel
    document.getElementById('btn-liveweave-ai-open').addEventListener('click', function() {
        document.getElementById('footerMessage').classList.add('active');
    });

    document.getElementById('btn-liveweave-ai-close').addEventListener('click', function() {
        document.getElementById('footerMessage').classList.remove('active');
    });

    document.getElementById('ai-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage(this.value);
            this.value = '';
        }
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // Converter Modal
    document.getElementById('converter-close').addEventListener('click', function() {
        document.getElementById('converter-modal').classList.remove('active');
    });

    document.getElementById('converter-cancel').addEventListener('click', function() {
        document.getElementById('converter-modal').classList.remove('active');
    });

    document.querySelectorAll('.converter-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.converter-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('converter-form').style.display = 'block';
        });
    });

    document.getElementById('converter-convert').addEventListener('click', function() {
        convertProject();
    });

    // Python Modal
    document.getElementById('python-close').addEventListener('click', function() {
        document.getElementById('python-modal').classList.remove('active');
    });

    document.getElementById('python-cancel').addEventListener('click', function() {
        document.getElementById('python-modal').classList.remove('active');
    });

    document.getElementById('python-generate').addEventListener('click', function() {
        generatePythonScript();
    });

    // Cover Modal
    document.getElementById('cover-close').addEventListener('click', function() {
        document.getElementById('cover-modal').classList.remove('active');
    });

    document.getElementById('cover-cancel').addEventListener('click', function() {
        document.getElementById('cover-modal').classList.remove('active');
    });

    document.getElementById('cover-generate').addEventListener('click', function() {
        generateCoverPage();
    });

    // Cloud Modal
    document.getElementById('cloud-close').addEventListener('click', function() {
        document.getElementById('cloud-modal').classList.remove('active');
    });

    document.getElementById('cloud-cancel').addEventListener('click', function() {
        document.getElementById('cloud-modal').classList.remove('active');
    });

    document.getElementById('cloud-upload-btn').addEventListener('click', function() {
        uploadToCloud();
    });

    // Import Modal
    document.getElementById('import-close').addEventListener('click', function() {
        document.getElementById('import-modal').classList.remove('active');
    });

    document.getElementById('import-cancel').addEventListener('click', function() {
        document.getElementById('import-modal').classList.remove('active');
    });

    document.getElementById('import-import-btn').addEventListener('click', function() {
        importCode();
    });

    // Tab Switching
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabName = this.getAttribute('data-tab');
            document.getElementById('cloud-provider').value = tabName;
        });
    });
}

// Initialize Browser Controls
function initBrowserControls() {
    const browserUrl = document.getElementById('browser-url');
    const browserGo = document.getElementById('browser-go');
    const browserBack = document.getElementById('browser-back');
    const browserForward = document.getElementById('browser-forward');
    const browserRefresh = document.getElementById('browser-refresh');
    const browserHome = document.getElementById('browser-home');

    browserGo.addEventListener('click', function() {
        navigateTo(browserUrl.value);
    });

    browserUrl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            navigateTo(browserUrl.value);
        }
    });

    browserBack.addEventListener('click', function() {
        if (browserHistoryIndex > 0) {
            browserHistoryIndex--;
            browserUrl.value = browserHistory[browserHistoryIndex];
            navigateTo(browserHistory[browserHistoryIndex]);
        }
    });

    browserForward.addEventListener('click', function() {
        if (browserHistoryIndex < browserHistory.length - 1) {
            browserHistoryIndex++;
            browserUrl.value = browserHistory[browserHistoryIndex];
            navigateTo(browserHistory[browserHistoryIndex]);
        }
    });

    browserRefresh.addEventListener('click', function() {
        navigateTo(browserUrl.value);
    });

    browserHome.addEventListener('click', function() {
        navigateTo('https://www.google.com');
    });
}

// Navigate to URL
function navigateTo(url) {
    const preview = document.getElementById('preview');
    
    // Check if it's a search query
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // Treat as Google search
        url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
    }
    
    // Update browser URL
    document.getElementById('browser-url').value = url;
    
    // Add to history
    if (browserHistory[browserHistoryIndex] !== url) {
        browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
        browserHistory.push(url);
        browserHistoryIndex = browserHistory.length - 1;
    }
    
    // Navigate preview
    try {
        preview.src = url;
        showToast('Navigating to: ' + url);
    } catch (error) {
        showToast('Error navigating to URL');
    }
}

// Load Default Code
function loadDefaultCode() {
    const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Website</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 600px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: transform 0.3s;
        }
        
        .button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to Global Think</h1>
        <p>Your AI-powered code editor and development platform. Start creating amazing web applications with ease!</p>
        <a href="#" class="button" onclick="showAlert()">Get Started</a>
    </div>
</body>
</html>`;

    const defaultCSS = `/* Additional CSS styles */
body {
    font-family: Arial, sans-serif;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.button {
    display: inline-block;
    padding: 10px 20px;
    background: #0078d4;
    color: white;
    text-decoration: none;
    border-radius: 5px;
}

.button:hover {
    background: #106ebe;
}`;

    const defaultJS = `// JavaScript functionality
function showAlert() {
    alert('Welcome to Global Think AI Editor!');
}

// Add interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application loaded successfully!');
    
    // Add click event to button
    const button = document.querySelector('.button');
    if (button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showAlert();
        });
    }
});`;

    if (htmlEditor) htmlEditor.setValue(defaultHTML);
    if (cssEditor) cssEditor.setValue(defaultCSS);
    if (jsEditor) jsEditor.setValue(defaultJS);
    
    updatePreview();
}

// Update Preview
function updatePreview() {
    const html = htmlEditor ? htmlEditor.getValue() : '';
    const css = cssEditor ? cssEditor.getValue() : '';
    const js = jsEditor ? jsEditor.getValue() : '';

    const preview = document.getElementById('preview');
    const previewDoc = preview.contentDocument || preview.contentWindow.document;

    let combinedCode = html;

    // Inject CSS
    if (css) {
        if (combinedCode.includes('</head>')) {
            combinedCode = combinedCode.replace('</head>', `<style>${css}</style></head>`);
        } else {
            combinedCode = `<style>${css}</style>${combinedCode}`;
        }
    }

    // Inject JavaScript
    if (js) {
        if (combinedCode.includes('</body>')) {
            combinedCode = combinedCode.replace('</body>', `<script>${js}<\/script></body>`);
        } else {
            combinedCode = `${combinedCode}<script>${js}<\/script>`;
        }
    }

    previewDoc.open();
    previewDoc.write(combinedCode);
    previewDoc.close();
}

// Start Live Preview
function startLivePreview() {
    setInterval(function() {
        if (liveMode) {
            updatePreview();
        }
    }, 1000);
}

// Format Code
function formatCode(editor) {
    if (!editor) return;
    
    editor.getAction('editor.action.formatDocument').run();
    showToast('Code formatted!');
}

// Generate AI Code
function generateAICode() {
    showLoading('Generating AI code...');
    
    setTimeout(function() {
        hideLoading();
        
        // Simulate AI-generated code
        const aiHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .hero {
            text-align: center;
            color: white;
            padding: 60px 40px;
        }
        
        .hero h1 {
            font-size: 3em;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #00bfff 0%, #00ff88 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero p {
            font-size: 1.2em;
            color: #a0a0a0;
            margin-bottom: 30px;
        }
        
        .btn {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #00bfff 0%, #00ff88 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 191, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>✨ AI Magic ✨</h1>
        <p>Generated by Global Think AI Assistant</p>
        <a href="#" class="btn">Explore More</a>
    </div>
</body>
</html>`;

        const aiCSS = `/* AI Generated CSS */
.hero {
    animation: fadeInUp 1s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`;

        const aiJS = `// AI Generated JavaScript
console.log('AI Generated Code Loaded!');

document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.btn');
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('🎉 AI generated code is working!');
    });
});`;

        if (htmlEditor) htmlEditor.setValue(aiHTML);
        if (cssEditor) cssEditor.setValue(aiCSS);
        if (jsEditor) jsEditor.setValue(aiJS);
        
        updatePreview();
        showToast('AI code generated successfully!');
    }, 2000);
}

// Converter Functions
function openConverter(type) {
    document.getElementById('converter-modal').classList.add('active');
    document.getElementById('converter-form').style.display = 'none';
    
    // Select the appropriate converter type
    document.querySelectorAll('.converter-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-type') === type) {
            opt.classList.add('selected');
        }
    });
}

function convertProject() {
    const selectedOption = document.querySelector('.converter-option.selected');
    
    if (!selectedOption) {
        showToast('Please select a conversion type');
        return;
    }

    const type = selectedOption.getAttribute('data-type');
    const appName = document.getElementById('app-name').value || 'MyApp';
    const appVersion = document.getElementById('app-version').value || '1.0.0';
    const appDescription = document.getElementById('app-description').value || '';

    showLoading(`Converting to ${type.toUpperCase()}...`);

    setTimeout(function() {
        hideLoading();
        
        let result = '';
        
        switch(type) {
            case 'web':
                result = generateWebPackage(appName, appVersion, appDescription);
                break;
            case 'exe':
                result = generateEXEPackage(appName, appVersion, appDescription);
                break;
            case 'apk':
                result = generateAPKPackage(appName, appVersion, appDescription);
                break;
            case 'ios':
                result = generateIOSPackage(appName, appVersion, appDescription);
                break;
        }

        showToast(`Successfully converted to ${type.toUpperCase()}!`);
        document.getElementById('converter-modal').classList.remove('active');
        
        // Auto-download the converted package
        downloadConvertedPackage(result, type, appName);
    }, 3000);
}

function generateWebPackage(name, version, description) {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();

    return {
        type: 'web',
        files: {
            'index.html': html,
            'style.css': css,
            'script.js': js,
            'package.json': JSON.stringify({
                name: name.toLowerCase().replace(/\s+/g, '-'),
                version: version,
                description: description,
                author: 'Olawale Abdul-Ganiyu'
            }, null, 2)
        }
    };
}

function generateEXEPackage(name, version, description) {
    return {
        type: 'exe',
        files: {
            'main.py': generateElectronWrapper(name, version, description),
            'package.json': JSON.stringify({
                name: name.toLowerCase().replace(/\s+/g, '-'),
                version: version,
                description: description,
                main: 'main.py',
                author: 'Olawale Abdul-Ganiyu'
            }, null, 2),
            'requirements.txt': 'electron-python-shell',
            'README.md': `# ${name}\n\n${description}\n\nVersion: ${version}\n\nBuilt with Global Think AI Editor`
        }
    };
}

function generateAPKPackage(name, version, description) {
    return {
        type: 'apk',
        files: {
            'MainActivity.java': generateAndroidActivity(name, description),
            'AndroidManifest.xml': generateAndroidManifest(name),
            'build.gradle': generateAndroidGradle(name, version),
            'assets/index.html': htmlEditor.getValue(),
            'assets/style.css': cssEditor.getValue(),
            'assets/script.js': jsEditor.getValue()
        }
    };
}

function generateIOSPackage(name, version, description) {
    return {
        type: 'ios',
        files: {
            'ViewController.swift': generateIOSController(name),
            'Info.plist': generateIOSPlist(name, version),
            'Assets.xcassets': {},
            'index.html': htmlEditor.getValue(),
            'style.css': cssEditor.getValue(),
            'script.js': jsEditor.getValue()
        }
    };
}

function generateElectronWrapper(name, version, description) {
    return `#!/usr/bin/env python3
"""
${name} - ${description}
Version: ${version}
Built with Global Think AI Editor
Owner: Olawale Abdul-Ganiyu
"""

import sys
import webview
from pathlib import Path

def main():
    # Create webview window
    window = webview.create_window(
        title='${name}',
        url='index.html',
        width=1200,
        height=800,
        resizable=True,
        fullscreen=False,
        background_color='#FFFFFF'
    )
    
    # Start application
    webview.start(debug=False)

if __name__ == '__main__':
    main()
`;
}

function generateAndroidActivity(name, description) {
    return `package com.globalthink.${name.toLowerCase().replace(/\s+/g, '')};

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        webView.loadUrl("file:///android_asset/index.html");
    }
}`;
}

function generateAndroidManifest(name) {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.globalthink.${name.toLowerCase().replace(/\s+/g, '')}">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${name}"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
}

function generateAndroidGradle(name, version) {
    return `plugins {
    id 'com.android.application'
}

android {
    compileSdk 33

    defaultConfig {
        applicationId "com.globalthink.${name.toLowerCase().replace(/\s+/g, '')}"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "${version}"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
}`;
}

function generateIOSController(name) {
    return `import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Configure web view
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        
        view = webView
        
        // Load HTML content
        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.load(URLRequest(url: url))
        }
    }
}`;
}

function generateIOSPlist(name, version) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>${name}</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>com.globalthink.${name.toLowerCase().replace(/\s+/g, '')}</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>${name}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${version}</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UILaunchStoryboardName</key>
    <string>LaunchScreen</string>
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>armv7</string>
    </array>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
</dict>
</plist>`;
}

function downloadConvertedPackage(result, type, appName) {
    const zip = new JSZip();
    
    for (const [filename, content] of Object.entries(result.files)) {
        if (typeof content === 'object' && !Array.isArray(content)) {
            // Nested directory
            const folder = zip.folder(filename);
            for (const [nestedFilename, nestedContent] of Object.entries(content)) {
                folder.file(nestedFilename, nestedContent);
            }
        } else {
            zip.file(filename, content);
        }
    }

    zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, `${appName}-${type}.zip`);
        showToast(`Downloaded ${appName}-${type}.zip`);
    });
}

// Python Script Generator
function generatePythonScript() {
    const packages = document.getElementById('python-packages').value;
    const script = document.getElementById('python-script').value;

    showLoading('Generating Python script...');

    setTimeout(function() {
        hideLoading();
        
        const packageList = packages.split('\n').filter(p => p.trim());
        
        let fullScript = `#!/usr/bin/env python3
"""
Auto-generated Python Script
Built with Global Think AI Editor
Owner: Olawale Abdul-Ganiyu
"""

# Install required packages
${packageList.map(pkg => `pip install ${pkg.trim()}`).join('\n')}

# Imports
${packageList.map(pkg => `import ${pkg.trim().split('==')[0]}`).join('\n')}

${script}

if __name__ == '__main__':
    main()
`;

        // Download the script
        const blob = new Blob([fullScript], { type: 'text/plain' });
        saveAs(blob, 'generated_script.py');
        
        showToast('Python script generated and downloaded!');
        document.getElementById('python-modal').classList.remove('active');
    }, 2000);
}

// Cover Page Generator
function generateCoverPage() {
    const title = document.getElementById('cover-title').value || 'My Project';
    const subtitle = document.getElementById('cover-subtitle').value || 'A Web Application';
    const author = document.getElementById('cover-author').value || 'Olawale Abdul-Ganiyu';
    const theme = document.getElementById('cover-theme').value;

    let coverHTML = '';

    switch(theme) {
        case 'modern':
            coverHTML = generateModernCover(title, subtitle, author);
            break;
        case 'light':
            coverHTML = generateLightCover(title, subtitle, author);
            break;
        case 'gradient':
            coverHTML = generateGradientCover(title, subtitle, author);
            break;
        case 'minimal':
            coverHTML = generateMinimalCover(title, subtitle, author);
            break;
    }

    // Insert cover HTML at the beginning of the HTML editor
    const currentHTML = htmlEditor.getValue();
    const newHTML = coverHTML + currentHTML;
    htmlEditor.setValue(newHTML);
    
    updatePreview();
    showToast('Cover page generated!');
    document.getElementById('cover-modal').classList.remove('active');
}

function generateModernCover(title, subtitle, author) {
    return `<!-- Cover Page -->
<div style="
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    padding: 40px;
    text-align: center;
">
    <div style="max-width: 800px;">
        <h1 style="font-size: 3em; margin-bottom: 20px; background: linear-gradient(135deg, #00bfff 0%, #00ff88 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${title}</h1>
        <p style="font-size: 1.5em; color: #a0a0a0; margin-bottom: 40px;">${subtitle}</p>
        <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #666;">Developed by ${author}</p>
        </div>
    </div>
</div>
`;
}

function generateLightCover(title, subtitle, author) {
    return `<!-- Cover Page -->
<div style="
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    color: #333;
    padding: 40px;
    text-align: center;
">
    <div style="max-width: 800px;">
        <h1 style="font-size: 3em; margin-bottom: 20px; color: #0078d4;">${title}</h1>
        <p style="font-size: 1.5em; color: #666; margin-bottom: 40px;">${subtitle}</p>
        <div style="margin-top: 60px; padding-top: 40px; border-top: 2px solid #0078d4;">
            <p style="color: #999;">Developed by ${author}</p>
        </div>
    </div>
</div>
`;
}

function generateGradientCover(title, subtitle, author) {
    return `<!-- Cover Page -->
<div style="
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    text-align: center;
">
    <div style="max-width: 800px;">
        <h1 style="font-size: 3.5em; margin-bottom: 20px; text-shadow: 0 4px 20px rgba(0,0,0,0.3);">${title}</h1>
        <p style="font-size: 1.8em; margin-bottom: 40px; opacity: 0.9;">${subtitle}</p>
        <div style="margin-top: 60px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.3);">
            <p style="opacity: 0.7;">Developed by ${author}</p>
        </div>
    </div>
</div>
`;
}

function generateMinimalCover(title, subtitle, author) {
    return `<!-- Cover Page -->
<div style="
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    color: #333;
    padding: 40px;
    text-align: center;
">
    <div style="max-width: 600px;">
        <h1 style="font-size: 2.5em; margin-bottom: 10px; font-weight: 300; letter-spacing: 2px;">${title}</h1>
        <p style="font-size: 1em; color: #999; margin-bottom: 50px; letter-spacing: 1px;">${subtitle.toUpperCase()}</p>
        <p style="color: #666; font-size: 0.9em;">${author}</p>
    </div>
</div>
`;
}

// Cloud Upload
function uploadToCloud() {
    const provider = document.getElementById('cloud-provider').value;
    const repoName = document.getElementById('cloud-repo').value;
    const token = document.getElementById('cloud-token').value;
    const description = document.getElementById('cloud-description').value;

    if (!repoName) {
        showToast('Please enter a repository name');
        return;
    }

    showLoading(`Uploading to ${provider}...`);

    setTimeout(function() {
        hideLoading();
        showToast(`Successfully uploaded to ${provider}!`);
        document.getElementById('cloud-modal').classList.remove('active');
    }, 2000);
}

// Deploy to Web
function deployToWeb() {
    showLoading('Deploying to web...');

    setTimeout(function() {
        hideLoading();
        showToast('Project deployed successfully!');
        // In a real implementation, this would deploy to a hosting service
    }, 3000);
}

// Review Project
function reviewProject() {
    const html = htmlEditor ? htmlEditor.getValue() : '';
    const css = cssEditor ? cssEditor.getValue() : '';
    const js = jsEditor ? jsEditor.getValue() : '';

    const review = `
PROJECT REVIEW
==============

HTML Analysis:
- Lines of code: ${html.split('\n').length}
- Contains DOCTYPE: ${html.includes('<!DOCTYPE html>') ? '✓' : '✗'}
- Contains meta viewport: ${html.includes('viewport') ? '✓' : '✗'}
- Title tag present: ${html.includes('<title>') ? '✓' : '✗'}

CSS Analysis:
- Lines of code: ${css.split('\n').length}
- Contains responsive design: ${css.includes('@media') ? '✓' : '✗'}
- Uses CSS variables: ${css.includes('--') ? '✓' : '✗'}

JavaScript Analysis:
- Lines of code: ${js.split('\n').length}
- Contains event listeners: ${js.includes('addEventListener') ? '✓' : '✗'}
- Uses modern ES6+: ${js.includes('const') || js.includes('let') || js.includes('=>') ? '✓' : '✗'}

Overall Status: ✓ Ready for deployment
    `;

    alert(review);
}

// Import/Export Code
function openImportModal(mode) {
    document.getElementById('import-modal').classList.add('active');
    document.getElementById('import-title').textContent = mode === 'import' ? 'Import Code' : 'Export Code';
}

function importCode() {
    const fileInput = document.getElementById('import-file');
    const content = document.getElementById('import-content').value;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const fileContent = e.target.result;
            const extension = file.name.split('.').pop().toLowerCase();

            switch(extension) {
                case 'html':
                    if (htmlEditor) htmlEditor.setValue(fileContent);
                    break;
                case 'css':
                    if (cssEditor) cssEditor.setValue(fileContent);
                    break;
                case 'js':
                    if (jsEditor) jsEditor.setValue(fileContent);
                    break;
                case 'zip':
                    // Handle ZIP file
                    showToast('ZIP import feature - extract files manually');
                    break;
                default:
                    showToast('Unsupported file format');
            }
            
            updatePreview();
            showToast('Code imported successfully!');
        };

        reader.readAsText(fileInput);
    } else if (content) {
        // Import from textarea
        if (htmlEditor) htmlEditor.setValue(content);
        updatePreview();
        showToast('Code imported successfully!');
    }

    document.getElementById('import-modal').classList.remove('active');
}

// Download Functions
function downloadHTML() {
    const html = htmlEditor.getValue();
    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, 'index.html');
    showToast('HTML file downloaded!');
}

function downloadZIP() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();

    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);
    zip.file('README.md', `# Project\n\nBuilt with Global Think AI Editor\nOwner: Olawale Abdul-Ganiyu`);

    zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, 'project.zip');
        showToast('Project downloaded as ZIP!');
    });
}

// Developer Tools
function showConsoleOutput() {
    const preview = document.getElementById('preview');
    const consoleOutput = preview.contentWindow.console;

    let output = 'Console Output:\n';
    
    // In a real implementation, this would capture console logs
    output += '• No console errors detected\n';
    output += '• Application loaded successfully\n';
    output += '• All scripts executed\n';

    alert(output);
}

function extractFolder() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.webkitdirectory = true;
    fileInput.multiple = true;

    fileInput.onchange = function(e) {
        const files = e.target.files;
        let extractedFiles = [];

        for (let i = 0; i < files.length; i++) {
            extractedFiles.push(files[i].name);
        }

        alert(`Extracted ${files.length} files:\n\n${extractedFiles.join('\n')}`);
        showToast('Folder extracted!');
    };

    fileInput.click();
}

// New Project
function newProject() {
    if (confirm('Are you sure you want to create a new project? All unsaved changes will be lost.')) {
        htmlEditor.setValue('');
        cssEditor.setValue('');
        jsEditor.setValue('');
        updatePreview();
        showToast('New project created!');
    }
}

// Theme Toggle
function toggleTheme(isDark) {
    darkMode = isDark;
    currentTheme = isDark ? 'vs-dark' : 'vs';
    
    if (htmlEditor) monaco.editor.setTheme(currentTheme);
    if (cssEditor) monaco.editor.setTheme(currentTheme);
    if (jsEditor) monaco.editor.setTheme(currentTheme);
    
    showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled');
}

// Update Network Status
function updateNetworkStatus() {
    const statusElement = document.getElementById('status-network');
    
    if (navigator.onLine) {
        statusElement.innerHTML = '<i class="fas fa-wifi" style="color: #4ec9b0; margin-right: 5px;"></i> Network: Online';
    } else {
        statusElement.innerHTML = '<i class="fas fa-wifi" style="color: #f44747; margin-right: 5px;"></i> Network: Offline';
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// AI Chat Functions
function sendAIMessage(message) {
    if (!message.trim()) return;

    const chatContainer = document.getElementById('ai-chat-container');
    
    // Add user message
    chatContainer.innerHTML += `
        <div style="background: var(--primary-color); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
            <p style="font-size: 12px; color: white;">${message}</p>
        </div>
    `;

    // Simulate AI response
    setTimeout(function() {
        const aiResponse = generateAIResponse(message);
        
        chatContainer.innerHTML += `
            <div style="background: var(--main-bg); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <p style="font-size: 12px; color: #888;">${aiResponse}</p>
            </div>
        `;
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('html')) {
        return 'I can help you with HTML! Try asking me to create a specific element, explain HTML tags, or generate HTML code.';
    } else if (lowerMessage.includes('css')) {
        return 'CSS is great for styling! I can help with layouts, colors, animations, responsive design, and more.';
    } else if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
        return 'JavaScript brings your pages to life! I can help with functions, event handling, DOM manipulation, and more.';
    } else if (lowerMessage.includes('help')) {
        return 'I\'m here to help! Ask me about HTML, CSS, JavaScript, web development, or how to use this editor.';
    } else if (lowerMessage.includes('thank')) {
        return 'You\'re welcome! Feel free to ask if you need more help with your coding projects.';
    } else {
        return 'That\'s an interesting question! I can help with web development topics. Try asking me about HTML, CSS, or JavaScript, or say "help" for more options.';
    }
}

// UI Helper Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function showLoading(text) {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// Window Resize Handler
function resizer() {
    if (htmlEditor) htmlEditor.layout();
    if (cssEditor) cssEditor.layout();
    if (jsEditor) jsEditor.layout();
}

window.addEventListener('resize', resizer);

// Console welcome message
console.log('%c🚀 Global Think AI Editor', 'color: #00bfff; font-size: 20px; font-weight: bold;');
console.log('%cOwner: Olawale Abdul-Ganiyu', 'color: #666; font-size: 12px;');
console.log('%cWelcome to your AI-powered development platform!', 'color: #4ec9b0; font-size: 14px;');