import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import '../App.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Demo data when backend/WebSocket doesn't provide chart data (e.g. no Python client connected)
const DEMO_EDU_CATEGORIES = [
    'Less than high school', 'High school diploma', 'Some college', "Bachelor's degree",
    "Master's degree", "Doctoral degree", 'Professional degree', 'No degree'
];
const DEMO_EDU_2019 = [0.35, 0.52, 0.61, 0.78, 0.85, 0.92, 0.88, 0.45];
const DEMO_EDU_2023 = [0.28, 0.48, 0.58, 0.82, 0.88, 0.95, 0.90, 0.50];

const DEMO_OCC_TITLES = [
    'Management', 'Business & financial', 'Computer & math', 'Architecture & engineering',
    'Life & physical science', 'Community & social', 'Legal', 'Education & library', 'Arts & media'
];
const DEMO_MEDIAN_2019 = [0.72, 0.68, 0.85, 0.78, 0.75, 0.58, 0.88, 0.62, 0.55];
const DEMO_MEDIAN_2023 = [0.78, 0.74, 0.92, 0.82, 0.80, 0.62, 0.90, 0.66, 0.60];

const DEMO_SKILL_LABELS = ['Analysis', 'Communication', 'Leadership', 'Tech', 'Research', 'Teaching', 'Creativity', 'Problem-solving', 'Teamwork', 'Writing', 'Data', 'Planning', 'Customer service', 'Detail', 'Adaptability', 'Initiative'];
const DEMO_SKILL_GROUPS = ['Management', 'Business', 'Technical'];
const DEMO_SKILL_DATA = [
    [0.7, 0.8, 0.9, 0.5, 0.6, 0.4, 0.5, 0.8, 0.85, 0.7, 0.6, 0.9, 0.5, 0.7, 0.75, 0.8],
    [0.6, 0.9, 0.6, 0.4, 0.5, 0.3, 0.4, 0.7, 0.7, 0.85, 0.75, 0.8, 0.8, 0.85, 0.6, 0.7],
    [0.4, 0.5, 0.4, 0.95, 0.9, 0.3, 0.6, 0.9, 0.6, 0.5, 0.95, 0.6, 0.4, 0.8, 0.7, 0.65],
];

// Sample scores for main radar when user hasn't completed questionnaire (so chart is never empty)
const DEMO_FINAL_SCORES = [820, 780, 900, 650, 580, 720, 880, 710, 690, 750, 620, 540, 480, 510, 590, 670, 730, 410, 550, 600, 520, 610];

function isMissingOrEmpty(arr, placeholder) {
    if (!Array.isArray(arr) || arr.length === 0) return true;
    if (placeholder === 'No Data') return arr.every((v) => v === 'No Data' || v == null);
    return arr.every((v) => Number(v) === 0 || v == null);
}

function toNumbers(arr, fallback = 0) {
    if (!Array.isArray(arr)) return [];
    return arr.map((v) => (v != null && v !== '' ? Number(v) : fallback));
}

const ChartPage = () => {
    const location = useLocation();
    const hasState = location.state != null && Object.keys(location.state).length > 0;

    const rawFinalScores = location.state?.finalScores || new Array(22).fill(0);
    const finalScoresAllZero = rawFinalScores.length > 0 && rawFinalScores.every((v) => Number(v) === 0);
    const useDemoMainScores = !hasState || finalScoresAllZero;
    const finalScores = useDemoMainScores
        ? DEMO_FINAL_SCORES.slice(0, 22)
        : toNumbers(rawFinalScores.slice(0, 22), 0);
    while (finalScores.length < 22) finalScores.push(0);

    const rawEduCategories = location.state?.edu_categories || new Array(8).fill('No Data');
    const rawEdu2019 = location.state?.edu_values_2019_scaled || new Array(8).fill(0);
    const rawEdu2023 = location.state?.edu_values_2023_scaled || new Array(8).fill(0);

    const rawOccTitle = location.state?.occ_title || new Array(9).fill('No Data');
    const rawMedian2019 = location.state?.a_median_2019 || new Array(9).fill(0);
    const rawMedian2023 = location.state?.a_median_2023 || new Array(9).fill(0);

    const occupational_groups = location.state?.occupational_groups || DEMO_SKILL_GROUPS;
    const rawSkillData = location.state?.skill_data || [
        new Array(16).fill(0),
        new Array(16).fill(0),
        new Array(16).fill(0),
    ];

    const useDemoEducation = !hasState || isMissingOrEmpty(rawEduCategories, 'No Data') || isMissingOrEmpty(rawEdu2019);
    const useDemoOccupation = !hasState || isMissingOrEmpty(rawOccTitle, 'No Data') || isMissingOrEmpty(rawMedian2019);
    const useDemoSkills = !hasState || rawSkillData.every((row) => isMissingOrEmpty(row));

    const edu_categories = useDemoEducation ? DEMO_EDU_CATEGORIES : rawEduCategories;
    const edu_values_2019_scaled = useDemoEducation ? DEMO_EDU_2019 : toNumbers(rawEdu2019);
    const edu_values_2023_scaled = useDemoEducation ? DEMO_EDU_2023 : toNumbers(rawEdu2023);

    const occ_title = useDemoOccupation ? DEMO_OCC_TITLES : rawOccTitle;
    const a_median_2019 = useDemoOccupation ? DEMO_MEDIAN_2019 : toNumbers(rawMedian2019);
    const a_median_2023 = useDemoOccupation ? DEMO_MEDIAN_2023 : toNumbers(rawMedian2023);

    const skill_data = useDemoSkills ? DEMO_SKILL_DATA : rawSkillData.map((row) => toNumbers(row));

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
      return Math.min(100, Math.round(avg));
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
                data: [...finalScores],
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

    const eduLabels = Array.isArray(edu_categories) ? edu_categories : [];
    const education = {
        labels: eduLabels.length ? eduLabels : DEMO_EDU_CATEGORIES,
        datasets: [
            {
                label: 'Jobs 2019',
                data: toNumbers(edu_values_2019_scaled).slice(0, eduLabels.length || 8).concat(new Array(Math.max(0, (eduLabels.length || 8) - edu_values_2019_scaled.length)).fill(0)).slice(0, eduLabels.length || 8),
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
    const skillLabels = (location.state?.skill_column && location.state.skill_column.some((l) => l && l !== 'No Data')) ? location.state.skill_column : DEMO_SKILL_LABELS;
    
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

    const radarScale = (suggestedMax = 1000) => ({
        min: 0,
        max: suggestedMax,
        beginAtZero: true,
        ticks: { stepSize: suggestedMax <= 1 ? 0.2 : suggestedMax / 5 },
    });

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: { r: radarScale(1000) },
    };
    const optionsEducation = { ...options, scales: { r: radarScale(1) } };
    const optionsOccupation = { ...options, scales: { r: radarScale(1) } };
    const optionsSkills = { ...options, scales: { r: radarScale(1) } };

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
            <span>{Math.round(dominantSkill.score)} / 1000</span>
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
                <strong>{Math.round(item.score)} / 1000</strong>
              </button>
            ))
          )}
        </div>

        <div className="chartContainer" style={{width: '90vw'}}>
          <div className="chartCard mainRadarCard">
            <h3>Career fit: Final scores vs focused recommendation</h3>
            {useDemoMainScores && <span className="chartBadge">Sample scores — complete the questionnaire for your results</span>}
            <Radar className="skills" style={{width: '100%', height: 'min(80vh, 520px)'}} data={skills} options={options} />
          </div>
          <div className="chartGrid">
            <div className="chartCard">
              <h3>Employment by education (2019 vs 2023)</h3>
              {useDemoEducation && <span className="chartBadge">Sample data</span>}
              <Radar className="education" style={{width: '100%', height: '320px'}} data={education} options={optionsEducation} />
            </div>
            <div className="chartCard">
              <h3>Median salary by occupation (2019 vs 2023)</h3>
              {useDemoOccupation && <span className="chartBadge">Sample data</span>}
              <Radar className="occupationsData" style={{width: '100%', height: '320px'}} data={occupationsData} options={optionsOccupation} />
            </div>
            <div className="chartCard">
              <h3>Skills by group</h3>
              {useDemoSkills && <span className="chartBadge">Sample data</span>}
              <Radar className="skillChartData" style={{width: '100%', height: '320px'}} data={skillChartData} options={optionsSkills} />
            </div>
          </div>
        </div>
        </div>
    );
};

export default ChartPage;
