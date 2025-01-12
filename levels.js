document.addEventListener('DOMContentLoaded', () => {
    // it will get current url as per the user selection
    const currentLevel = window.location.pathname.split('/').pop().replace('.html', '');
    const problems = PROBLEMS[currentLevel] || {};
    
    const problem_selector = document.getElementById('problem_selector');
    const problem_Title = document.getElementById('problem_Title');
    const problem_Description = document.getElementById('problem_Description');
    const functionSignature = document.getElementById('functionSignature');
    const codeEditor = document.getElementById('codeEditor');
    const submitButton = document.getElementById('submitButton');
    const results = document.getElementById('results');
    const testCasesList = document.getElementById('testCasesList');

    let editor;
    if (typeof CodeMirror !== 'undefined') {
        editor = CodeMirror.fromTextArea(codeEditor, {
            mode: 'python',
            theme: 'monokai',
            lineNumbers: true,
            indentUnit: 4,
            autoCloseBrackets: true,
            matchBrackets: true
        });
    }

    // it will load the problems as per the difficulty level selected
    function loadProblem(problemId) {
        const problem = problems[problemId];
        if (!problem) return;

        problem_Title.textContent = problem.title;
        problem_Description.textContent = problem.description;
        functionSignature.textContent = problem.functionSignature;

        // boiler coded
        const initialCode = problem.functionSignature + '\n    # Write your code here\n    pass';
        if (editor) {
            editor.setValue(initialCode);
        } else {
            codeEditor.value = initialCode;
        }

        // show all the test cases
        if (testCasesList) {
            testCasesList.innerHTML = problem.testCases
                .map((test, index) => `
                    <div class="test-case">
                        <div class="test-case-header">Test Case ${index + 1}</div>
                        <div class="test-case-body">
                            <div>Input: ${JSON.stringify(test.input)}</div>
                            <div>Expected: ${JSON.stringify(test.expected)}</div>
                        </div>
                    </div>
                `).join('');
        }
    }

    // evaluation of the code
    function evaluatePythonCode(code, functionName, testInput) {
        // Remove any leading/trailing whitespace
        code = code.trim();
        
        try {
            
            const func = new Function('input', `
                // Convert Python-style code to JavaScript
                ${pythonToJavaScript(code)}
                return ${functionName}(...input);
            `);
            
            
            return func(testInput);
        } catch (error) {
            throw new Error(`Execution error: ${error.message}`);
        }
    }

    // convert for pyhton to js code to evalauate
    function pythonToJavaScript(pythonCode) {
        return pythonCode
            .replace(/def\s+(\w+)\s*\((.*?)\):/g, 'function $1($2) {')
            .replace(/elif/g, 'else if')
            .replace(/:/g, ' {')
            .replace(/pass/g, '');
    }

    problem_selector.innerHTML = '<option value="" disabled>Select a problem</option>';
    Object.entries(problems).forEach(([id, problem]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = problem.title;
        problem_selector.appendChild(option);
    });

    problem_selector.addEventListener('change', (e) => {
        loadProblem(e.target.value);
        results.classList.add('hidden');
    });

    submitButton.addEventListener('click', async () => {
        const loader = submitButton.querySelector('.loader');
        const btnText = submitButton.querySelector('.btn-text');
        
        // Show loading state
        loader.classList.remove('hidden');
        btnText.classList.add('hidden');
        results.classList.add('hidden');

        try {
            const currentProblem = problems[problem_selector.value];
            const code = editor ? editor.getValue() : codeEditor.value;
            
            const functionName = currentProblem.functionSignature.split('def ')[1].split('(')[0];
            
            const testResults = currentProblem.testCases.map((testCase, index) => {
                const result = {
                    testNumber: index + 1,
                    input: testCase.input,
                    expected: testCase.expected,
                    actual: null,
                    passed: false
                };

                try {
                    result.actual = evaluatePythonCode(code, functionName, testCase.input);
                    result.passed = JSON.stringify(result.actual) === JSON.stringify(testCase.expected);
                } catch (error) {
                    result.actual = error.message;
                    result.passed = false;
                }

                return result;
            });

            displayResults(testResults);
        } catch (error) {
            console.error('Submission error:', error);
            results.innerHTML = `<div class="error">An error occurred while evaluating your code: ${error.message}</div>`;
        } finally {

            loader.classList.add('hidden');
            btnText.classList.remove('hidden');
            results.classList.remove('hidden');
        }
    });

    function displayResults(testResults) {
        const passedTests = testResults.filter(r => r.passed).length;
        const totalTests = testResults.length;
        const score = Math.round((passedTests / totalTests) * 100);

        results.innerHTML = `
            <div class="score-panel">
                <h3>Score: ${score}%</h3>
                <p>Passed ${passedTests} out of ${totalTests} tests</p>
            </div>
            <div class="test-results">
                ${testResults.map(result => `
                    <div class="test-case ${result.passed ? 'passed' : 'failed'}">
                        <h4>Test Case ${result.testNumber}: ${result.passed ? '✅ Passed' : '❌ Failed'}</h4>
                        <p>Input: ${JSON.stringify(result.input)}</p>
                        <p>Expected: ${JSON.stringify(result.expected)}</p>
                        <p>Actual: ${JSON.stringify(result.actual)}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (problem_selector.options.length > 1) {
        problem_selector.selectedIndex = 1;
        loadProblem(problem_selector.options[1].value);
    }
});