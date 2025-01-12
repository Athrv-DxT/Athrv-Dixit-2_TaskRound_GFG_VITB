let currentProblemId = '';
        const DIFFICULTY = 'BEGINNER'; // Will be replaced in each file

        async function loadProblems() {
            try {
                const response = await fetch(`http://localhost:5000/api/problems/${DIFFICULTY}`);
                const problems = await response.json();
                
                const problemsList = document.getElementById('problems-list');
                problemsList.innerHTML = '';
                
                for (const [id, problem] of Object.entries(problems)) {
                    const problemCard = document.createElement('div');
                    problemCard.className = 'problem-card';
                    problemCard.innerHTML = `
                        <h3>${problem.title}</h3>
                        <p>${problem.description}</p>
                        <button class="btn" onclick="openEditor('${id}', '${problem.title}', '${problem.description}', '${problem.function_signature}')">
                            Solve Problem
                        </button>
                    `;
                    problemsList.appendChild(problemCard);
                }
            } catch (error) {
                console.error('Error loading problems:', error);
            }
        }

        function openEditor(problemId, title, description, signature) {
            currentProblemId = problemId;
            document.getElementById('problem-title').textContent = title;
            document.getElementById('problem-description').textContent = description;
            document.getElementById('function-signature').textContent = signature;
            document.getElementById('code-editor').value = signature + '\n    # Write your code here\n    pass';
            
            document.getElementById('editor-section').style.display = 'block';
            document.getElementById('results').innerHTML = '';
            
            // Scroll to editor
            document.getElementById('editor-section').scrollIntoView({ behavior: 'smooth' });
        }

        async function submitSolution() {
            const code = document.getElementById('code-editor').value;
            try {
                const response = await fetch('http://localhost:5000/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        problem_id: currentProblemId,
                        code: code
                    })
                });
                
                const result = await response.json();
                
                let resultHTML = `
                    <h3>Results</h3>
                    <p>Score: ${result.score}%</p>
                    <p>Passed Tests: ${result.passed}/${result.total}</p>
                    <p>Average Time: ${result.average_time.toFixed(4)} seconds</p>
                    <h4>Test Cases:</h4>
                `;
                
                result.results.forEach((test, index) => {
                    resultHTML += `
                        <div class="test-case ${test.status === 'passed' ? 'test-passed' : 'test-failed'}">
                            <p>Test ${index + 1}: ${test.status}</p>
                            <p>Input: ${JSON.stringify(test.input)}</p>
                            ${test.status !== 'error' ? 
                                `<p>Expected: ${JSON.stringify(test.expected)}</p>
                                 <p>Actual: ${JSON.stringify(test.actual)}</p>` :
                                `<p>Error: ${test.error}</p>`
                            }
                            <p>Time: ${test.time.toFixed(4)}s</p>
                        </div>
                    `;
                });
                
                document.getElementById('results').innerHTML = resultHTML;
            } catch (error) {
                console.error('Error submitting solution:', error);
            }
        }

        // Load problems when page loads
        window.onload = loadProblems;