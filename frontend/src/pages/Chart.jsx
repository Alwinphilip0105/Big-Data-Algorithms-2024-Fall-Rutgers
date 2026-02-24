import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import '../App.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ChartPage = () => {
    const location = useLocation();
    const finalScores = location.state?.finalScores || new Array(22).fill(0); // Fallback to zeros if data is missing

    const edu_categories = location.state?.edu_categories || new Array(8).fill('No Data');
    const edu_values_2019_scaled = location.state?.edu_values_2019_scaled || new Array(8).fill(0);
    const edu_values_2023_scaled = location.state?.edu_values_2023_scaled || new Array(8).fill(0);
    // New variables
    const occ_title = location.state?.occ_title || new Array(9).fill('No Data');
    const a_median_2019 = location.state?.a_median_2019 || new Array(9).fill(0);
    const a_median_2023 = location.state?.a_median_2023 || new Array(9).fill(0);

    // Assuming these are 2D arrays and that skill_data is 3 sets of 16 skill values each
    const occupational_groups = location.state?.occupational_groups || ["Group 1", "Group 2", "Group 3"];
    const skill_data = location.state?.skill_data || [
      new Array(16).fill(0),
      new Array(16).fill(0),
      new Array(16).fill(0)
    ];

    const skillLabelsMain = [
      'Management occupations',
      'Business and financial operations occupations',
      'Computer and mathematical occupations',
      'Architecture and engineering occupations',
      'Life, physical, and social science occupations',
      'Community and social service occupations',
      'Legal occupations',
      'Educational instruction and library occupations',
      'Arts, design, entertainment, sports, and media occupations',
      'Healthcare practitioners and technical occupations',
      'Healthcare support occupations',
      'Protective service occupations',
      'Food preparation and serving related occupations',
      'Building and grounds cleaning and maintenance occupations',
      'Personal care and service occupations',
      'Sales and related occupations',
      'Office and administrative support occupations',
      'Farming, fishing, and forestry occupations',
      'Construction and extraction occupations',
      'Installation, maintenance, and repair occupations',
      'Production occupations',
      'Transportation and material moving occupations',
    ];

    const [topN, setTopN] = useState(5);
    const [minimumScore, setMinimumScore] = useState(50);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const rankedSuggestions = useMemo(() => {
      return skillLabelsMain
        .map((label, index) => ({ label, score: Number(finalScores[index] || 0), index }))
        .filter((item) => item.score >= minimumScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
    }, [finalScores, minimumScore, topN]);

    const dominantSkill = useMemo(() => {
      const ranked = skillLabelsMain
        .map((label, index) => ({ label, score: Number(finalScores[index] || 0), index }))
        .sort((a, b) => b.score - a.score);
      return ranked[0] || { label: 'No data', score: 0, index: 0 };
    }, [finalScores]);

    const confidenceScore = useMemo(() => {
      if (rankedSuggestions.length === 0) return 0;
      const avg = rankedSuggestions.reduce((sum, item) => sum + item.score, 0) / rankedSuggestions.length;
      return Math.round(avg);
    }, [rankedSuggestions]);

    const focusedScores = useMemo(() => {
      if (selectedIndex === null) {
        return new Array(skillLabelsMain.length).fill(0);
      }
      return skillLabelsMain.map((_, index) => (index === selectedIndex ? Number(finalScores[index] || 0) : 0));
    }, [selectedIndex, finalScores]);

    const skills = {
      labels: skillLabelsMain,
        datasets: [
            {
                label: 'Final Scores',
                data: finalScores,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
            },
              {
                label: 'Focused Recommendation',
                data: focusedScores,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.25)',
                borderColor: 'rgb(54, 162, 235)',
                pointBackgroundColor: 'rgb(54, 162, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(54, 162, 235)',
              },
        ],
    };

    const education = {
        labels: edu_categories,
        datasets: [
            {
                label: 'Jobs 2019',
                data: edu_values_2019_scaled,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Jobs 2023',
                data: edu_values_2023_scaled,
                fill: true,
                backgroundColor: 'rgba(8, 0, 225, 0.2)',
                borderColor: 'rgb(8, 0, 225)',
                pointBackgroundColor: 'rgb(8, 0, 225)',
                pointBorderColor: 'white',
                pointHoverBackgroundColor: 'blue',
                pointHoverBorderColor: 'rgb(8, 0, 225)',
            },
            
        ],
    };
const occupationsData = {
      labels: occ_title,
      datasets: [
        {
          label: '2019 Median Salary',
          data: a_median_2019,
          fill: true,
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgb(255, 206, 86)',
          pointBackgroundColor: 'rgb(255, 206, 86)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 206, 86)',
        },
        {
          label: '2023 Median Salary',
          data: a_median_2023,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)',
        }
      ]
    };
    const skillLabels = location.state?.skill_column || Array.from({ length: 16 }, (_, i) => `Skill ${i + 1}`);
    
    const skillDatasets = skill_data.map((row, index) => {
      const colors = [
        { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgb(255, 99, 132)' },
        { bg: 'rgba(8, 0, 225, 0.2)', border: 'rgb(8, 0, 225)' },
        { bg: 'rgba(0, 200, 100, 0.2)', border: 'rgb(0, 200, 100)' },
      ];

      const color = colors[index] || colors[0];
      return {
        label: occupational_groups[index] || `Group ${index + 1}`,
        data: row,
        fill: true,
        backgroundColor: color.bg,
        borderColor: color.border,
        pointBackgroundColor: color.border,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: color.border,
      };
    });

    const skillChartData = {
      labels: skillLabels,
      datasets: skillDatasets
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="chartBlock">
        <div className="dashboardHeader">
          <h2>Career Suggestion Dashboard</h2>
          <p>Use the controls to refine recommendations and explore skill alignment in real time.</p>
        </div>

        <div className="insightCards">
          <div className="insightCard">
            <h4>Top Suggested Domain</h4>
            <p>{dominantSkill.label}</p>
            <span>{Math.round(dominantSkill.score)} / 100</span>
          </div>
          <div className="insightCard">
            <h4>Recommendation Confidence</h4>
            <p>{confidenceScore}%</p>
            <span>Based on top {topN} domains</span>
          </div>
          <div className="insightCard">
            <h4>Qualified Domains</h4>
            <p>{rankedSuggestions.length}</p>
            <span>Above threshold {minimumScore}</span>
          </div>
        </div>

        <div className="dashboardControls">
          <label>
            Top Recommendations
            <select value={topN} onChange={(event) => setTopN(Number(event.target.value))}>
              <option value={3}>Top 3</option>
              <option value={5}>Top 5</option>
              <option value={8}>Top 8</option>
            </select>
          </label>

          <label>
            Minimum Score: {minimumScore}
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={minimumScore}
              onChange={(event) => setMinimumScore(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="recommendationList">
          {rankedSuggestions.length === 0 ? (
            <p>No recommendations match this threshold. Lower the minimum score.</p>
          ) : (
            rankedSuggestions.map((item) => (
              <button
                key={item.label}
                className={`recommendationItem ${selectedIndex === item.index ? 'active' : ''}`}
                onClick={() => setSelectedIndex(item.index)}
              >
                <span>{item.label}</span>
                <strong>{Math.round(item.score)}</strong>
              </button>
            ))
          )}
        </div>

        <div className="chartContainer" style={{width: '90vw', height: "90vh"}}>
          <Radar className="skills" style={{width: '80vw', height: "80vh"}} data={skills} options={options} />
          <Radar className="education" style={{width: '40vw', height: "40vh"}} data={education} options={options} />
          <Radar className="occupationsData" style={{width: '40vw', height: "40vh"}} data={occupationsData} options={options} />
          <Radar className="skillChartData" style={{width: '40vw', height: "40vh"}} data={skillChartData} options={options} />

            </div>
        </div>
    );
};

export default ChartPage;
