import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QueriesSection = () => {
  const queries = [
    {
      title: 'Most Dangerous Locations',
      code: `
      SELECT 
        l.street, 
        l.intersection, 
        COUNT(*) as severe_accident_count,
        ROUND(AVG(es.response_time), 2) as avg_response_time
      FROM Accidents a
      JOIN Locations l ON a.location_id = l.location_id
      JOIN EmergencyServices es ON a.accident_id = es.accident_id
      WHERE a.severity = 'severe'
      GROUP BY l.street, l.intersection
      ORDER BY severe_accident_count DESC
      LIMIT 5
      `,
      description: 'Identify the most dangerous locations with the highest number of severe accidents.',
      apiEndpoint: 'getMostDangerousLocations',
      results: 'Loading...',
    },
    {
      title: 'Emergency Service Efficiency',
      code: `
      SELECT 
        service_type, 
        COUNT(*) as total_responses,
        ROUND(AVG(response_time), 2) as avg_response_time,
        ROUND(MIN(response_time), 2) as min_response_time,
        ROUND(MAX(response_time), 2) as max_response_time
      FROM EmergencyServices
      GROUP BY service_type
      ORDER BY avg_response_time
      `,
      description: 'Calculate emergency service efficiency by different service types.',
      apiEndpoint: 'getEmergencyServiceEfficiency',
      results: 'Loading...',
    },
    {
      title: 'User Involvement by Severity',
      code: `
      SELECT 
        ua.involvement_type,
        a.severity,
        COUNT(*) as involvement_count,
        ROUND(COUNT(*) / (SELECT COUNT(*) FROM UserAccidents) * 100, 2) as percentage
      FROM UserAccidents ua
      JOIN Accidents a ON ua.accident_id = a.accident_id
      GROUP BY ua.involvement_type, a.severity
      ORDER BY involvement_count DESC
      `,
      description: 'Analyze user involvement patterns across different accident severities.',
      apiEndpoint: 'getUserInvolvementBySeverity',
      results: 'Loading...',
    },
    {
      title: 'Seasonal Accident Trends',
      code: `
      SELECT 
        CASE 
          WHEN MONTH(date_time) IN (12, 1, 2) THEN 'Winter'
          WHEN MONTH(date_time) IN (3, 4, 5) THEN 'Spring'
          WHEN MONTH(date_time) IN (6, 7, 8) THEN 'Summer'
          WHEN MONTH(date_time) IN (9, 10, 11) THEN 'Autumn'
        END as season,
        COUNT(*) as total_accidents,
        ROUND(AVG(CASE WHEN severity = 'severe' THEN 1 ELSE 0 END * 100), 2) as severe_accident_percentage
      FROM Accidents
      GROUP BY season
      ORDER BY total_accidents DESC
      `,
      description: 'Identify seasonal accident trends and analyze severity percentages by season.',
      apiEndpoint: 'getSeasonalAccidentTrends',
      results: 'Loading...',
    },
    {
      title: 'Accident Time Distribution',
      code: `
      SELECT 
        CASE 
          WHEN HOUR(date_time) BETWEEN 5 AND 11 THEN 'Morning'
          WHEN HOUR(date_time) BETWEEN 12 AND 16 THEN 'Afternoon'
          WHEN HOUR(date_time) BETWEEN 17 AND 20 THEN 'Evening'
          ELSE 'Night'
        END as time_of_day,
        COUNT(*) as accident_count,
        ROUND(AVG(
          CASE 
            WHEN severity = 'severe' THEN 1 
            WHEN severity = 'moderate' THEN 0.5 
            ELSE 0 
          END
        ) * 100, 2) as severity_index
      FROM Accidents
      GROUP BY time_of_day
      ORDER BY accident_count DESC
      `,
      description: 'Analyze the time distribution of accidents based on severity and time of day.',
      apiEndpoint: 'getAccidentTimeDistribution',
      results: 'Loading...',
    },
    {
      title: 'Response Time by User Role',
      code: `
      SELECT 
        u.user_role,
        COUNT(DISTINCT a.accident_id) as total_accident_involvement,
        ROUND(AVG(es.response_time), 2) as avg_emergency_response_time,
        ROUND(
          (SELECT AVG(response_time) FROM EmergencyServices) - 
          AVG(es.response_time),
          2
        ) as response_time_difference
      FROM Users u
      JOIN UserAccidents ua ON u.user_id = ua.user_id
      JOIN Accidents a ON ua.accident_id = a.accident_id
      JOIN EmergencyServices es ON a.accident_id = es.accident_id
      GROUP BY u.user_role
      ORDER BY total_accident_involvement DESC
      `,
      description: 'Compare emergency service response times across different user roles.',
      apiEndpoint: 'getResponseTimeByUserRole',
      results: 'Loading...',
    },
    {
      title: 'Accident Geographical Spread',
      code: `
      SELECT 
        ROUND(MIN(latitude), 2) as min_latitude,
        ROUND(MAX(latitude), 2) as max_latitude,
        ROUND(MIN(longitude), 2) as min_longitude,
        ROUND(MAX(longitude), 2) as max_longitude,
        COUNT(*) as total_accidents,
        ROUND(
          (
            (MAX(latitude) - MIN(latitude)) * 
            (MAX(longitude) - MIN(longitude))
          ),
          4
        ) as coverage_area
      FROM Locations l
      JOIN Accidents a ON l.location_id = a.location_id
      `,
      description: 'Analyze the geographical spread of accidents based on accident locations.',
      apiEndpoint: 'getAccidentGeographicalSpread',
      results: 'Loading...',
    },
    {
      title: 'Most Frequent Accident Causes',
      code: `
      SELECT 
        SUBSTRING_INDEX(SUBSTRING_INDEX(description, 'due to', -1), '.', 1) as cause,
        COUNT(*) as occurrence_count,
        ROUND(COUNT(*) / (SELECT COUNT(*) FROM Accidents) * 100, 2) as percentage
      FROM Accidents
      GROUP BY cause
      ORDER BY occurrence_count DESC
      LIMIT 10
      `,
      description: 'Identify the most frequent causes of accidents.',
      apiEndpoint: 'getMostFrequentAccidentCauses',
      results: 'Loading...',
    },
    {
      title: 'User Reporting Patterns',
      code: `
      SELECT 
        user_id,
        COUNT(*) as total_reports,
        COUNT(DISTINCT a.accident_id) as unique_accidents,
        ROUND(
          COUNT(DISTINCT a.accident_id) / COUNT(*) * 100,
          2
        ) as unique_report_percentage
      FROM UserAccidents ua
      JOIN Accidents a ON ua.accident_id = a.accident_id
      GROUP BY user_id
      ORDER BY total_reports DESC
      LIMIT 10
      `,
      description:
        'Calculate user reporting patterns, including the percentage of unique accidents reported by each user.',
      apiEndpoint: 'getUserReportingPatterns',
      results: 'Loading...',
    },
    {
      title: 'Intersection Complexity',
      code: `
      SELECT 
        l.intersection,
        COUNT(*) as total_accidents,
        ROUND(
          AVG(
            CASE 
              WHEN a.severity = 'severe' THEN 1 
              WHEN a.severity = 'moderate' THEN 0.5 
              ELSE 0 
            END
          ) * 100,
          2
        ) as severity_index,
        ROUND(AVG(es.response_time), 2) as avg_response_time
      FROM Locations l
      JOIN Accidents a ON l.location_id = a.location_id
      JOIN EmergencyServices es ON a.accident_id = es.accident_id
      GROUP BY l.intersection
      HAVING total_accidents > 1
      ORDER BY total_accidents DESC
      LIMIT 10
      `,
      description: 'Analyze the complexity of accidents at intersections, including severity index and response time.',
      apiEndpoint: 'getIntersectionComplexity',
      results: 'Loading...',
    },
    {
      title: 'Emergency Service Deployment',
      code: `
      SELECT 
        service_type,
        ROUND(AVG(response_time), 2) as avg_response_time,
        COUNT(DISTINCT accident_id) as total_deployments,
        ROUND(
          COUNT(DISTINCT CASE WHEN response_time > 30 THEN accident_id END) / 
          COUNT(DISTINCT accident_id) * 100,
          2
        ) as delayed_response_percentage
      FROM EmergencyServices
      GROUP BY service_type
      `,
      description: 'Track emergency service deployment patterns based on service types and response times.',
      apiEndpoint: 'getEmergencyServiceDeployment',
      results: 'Loading...',
    },
    {
      title: 'Accident Escalation Trends',
      code: `
      SELECT 
        YEAR(date_time) as year,
        MONTH(date_time) as month,
        COUNT(*) as total_accidents,
        ROUND(
          AVG(
            CASE 
              WHEN severity = 'severe' THEN 1 
              WHEN severity = 'moderate' THEN 0.5 
              ELSE 0 
            END
          ) * 100,
          2
        ) as severity_trend
      FROM Accidents
      GROUP BY year, month
      ORDER BY year, month
      `,
      description: 'Analyze the escalation of accidents over time, including trends in severity.',
      apiEndpoint: 'getAccidentEscalationTrends',
      results: 'Loading...',
    },
    {
      title: 'High-Risk User Groups',
      code: `
      SELECT 
        u.user_role,
        COUNT(DISTINCT a.accident_id) as total_accidents,
        ROUND(
          COUNT(DISTINCT 
            CASE WHEN a.severity = 'severe' 
            THEN a.accident_id END
          ) / COUNT(DISTINCT a.accident_id) * 100,
          2
        ) as severe_accident_percentage
      FROM Users u
      JOIN UserAccidents ua ON u.user_id = ua.user_id
      JOIN Accidents a ON ua.accident_id = a.accident_id
      GROUP BY u.user_role
      ORDER BY total_accidents DESC
      `,
      description: 'Identify high-risk user groups based on accident involvement and severity.',
      apiEndpoint: 'getHighRiskUserGroups',
      results: 'Loading...',
    },
    {
      title: 'Location Vulnerability Index',
      code: `
      SELECT 
        l.street,
        COUNT(*) as total_accidents,
        ROUND(
          SUM(
            CASE 
              WHEN a.severity = 'severe' THEN 3 
              WHEN a.severity = 'moderate' THEN 2 
              ELSE 1 
            END
          ) / COUNT(*),
          2
        ) as vulnerability_index,
        ROUND(AVG(es.response_time), 2) as avg_response_time
      FROM Locations l
      JOIN Accidents a ON l.location_id = a.location_id
      JOIN EmergencyServices es ON a.accident_id = es.accident_id
      GROUP BY l.street
      ORDER BY vulnerability_index DESC
      LIMIT 10
      `,
      description: 'Calculate the location vulnerability index based on accident severity and response time.',
      apiEndpoint: 'getLocationVulnerabilityIndex',
      results: 'Loading...',
    },
    {
      title: 'Multi-Service Accident Responses',
      code: `
      SELECT 
        a.accident_id,
        a.date_time,
        a.severity,
        COUNT(DISTINCT es.service_type) as service_types_involved,
        GROUP_CONCAT(DISTINCT es.service_type) as services
      FROM Accidents a
      JOIN EmergencyServices es ON a.accident_id = es.accident_id
      GROUP BY a.accident_id, a.date_time, a.severity
      HAVING service_types_involved > 1
      ORDER BY service_types_involved DESC
      LIMIT 20
      `,
      description:
        'Track multi-service accident responses, identifying incidents with multiple service types involved.',
      apiEndpoint: 'getMultiServiceAccidents',
      results: 'Loading...',
    },
    {
      title: 'Accident Cost Analysis',
      code: `
      SELECT 
        severity,
        COUNT(*) as total_accidents,
        ROUND(
          AVG(
            CASE 
              WHEN severity = 'severe' THEN 5000 
              WHEN severity = 'moderate' THEN 2000 
              ELSE 500 
            END
          ),
          2
        ) as estimated_average_cost,
        ROUND(
          COUNT(*) * 
          AVG(
            CASE 
              WHEN severity = 'severe' THEN 5000 
              WHEN severity = 'moderate' THEN 2000 
              ELSE 500 
            END
          ),
          2
        ) as total_estimated_cost
      FROM Accidents
      GROUP BY severity
      ORDER BY total_estimated_cost DESC
      `,
      description: 'Analyze the cost impact of accidents based on severity and estimate average costs.',
      apiEndpoint: 'getAccidentCostAnalysis',
      results: 'Loading...',
    },
    {
      title: 'User Fatigue and Accident Involvement',
      code: `
      SELECT 
        u.user_id,
        u.name,
        u.user_role,
        COUNT(DISTINCT ua.accident_id) as total_accidents,
        ROUND(
          AVG(
            CASE 
              WHEN TIME(a.date_time) BETWEEN '22:00:00' AND '06:00:00' 
              THEN 1 
              ELSE 0 
            END
          ) * 100,
          2
        ) as night_accident_percentage,
        ROUND(
          AVG(
            CASE 
              WHEN a.severity = 'severe' 
              THEN 1 
              ELSE 0 
            END
          ) * 100,
          2
        ) as severe_accident_percentage
      FROM Users u
      JOIN UserAccidents ua ON u.user_id = ua.user_id
      JOIN Accidents a ON ua.accident_id = a.accident_id
      GROUP BY u.user_id, u.name, u.user_role
      HAVING total_accidents > 3
      ORDER BY night_accident_percentage DESC
      LIMIT 15
      `,
      description:
        'Analyze the relationship between user fatigue and accident involvement, particularly during night hours.',
      apiEndpoint: 'getUserFatigueAnalysis',
      results: 'Loading...',
    },
    {
      title: 'Accident Reporting Efficiency',
      code: `
      SELECT 
    u.user_role,
    COUNT(DISTINCT ua.accident_id) AS total_reported_accidents,
    ROUND(
        AVG(
            TIMESTAMPDIFF(
                MINUTE, 
                a.date_time, 
                (SELECT MIN(es.response_time) FROM EmergencyServices es WHERE es.accident_id = a.accident_id)
            )
        ),
        2
    ) AS avg_reporting_delay,
    ROUND(
        COUNT(DISTINCT 
            CASE WHEN es.service_type IS NOT NULL 
            THEN ua.accident_id END
        ) / COUNT(DISTINCT ua.accident_id) * 100,
        2
    ) AS emergency_response_rate
FROM Users u
JOIN UserAccidents ua ON u.user_id = ua.user_id
JOIN Accidents a ON ua.accident_id = a.accident_id
LEFT JOIN EmergencyServices es ON a.accident_id = es.accident_id
GROUP BY u.user_role
ORDER BY total_reported_accidents DESC;
      `,
      description: 'Analyze the efficiency of accident reporting and communication based on response times.',
      apiEndpoint: 'getAccidentReportingEfficiency',
      results: 'Loading...',
    },
    {
      title: 'Cross-Involvement in Multiple Accidents',
      code: `
      SELECT 
        u.user_id,
        u.name,
        u.user_role,
        COUNT(DISTINCT ua.accident_id) as total_accidents,
        COUNT(DISTINCT 
          CASE WHEN a.severity = 'severe' 
          THEN ua.accident_id END
        ) as severe_accidents,
        ROUND(
          (
            COUNT(DISTINCT ua.accident_id) - 
            COUNT(DISTINCT 
              CASE WHEN ua.involvement_type = 'witness' 
              THEN ua.accident_id END
            )
          ) / COUNT(DISTINCT ua.accident_id) * 100,
          2
        ) as direct_involvement_percentage
      FROM Users u
      JOIN UserAccidents ua ON u.user_id = ua.user_id
      JOIN Accidents a ON ua.accident_id = a.accident_id
      GROUP BY u.user_id, u.name, u.user_role
      HAVING total_accidents > 2
      ORDER BY severe_accidents DESC, total_accidents DESC
      LIMIT 20
      `,
      description:
        'Analyze the cross-involvement patterns of users in multiple accidents, with a focus on direct involvement.',
      apiEndpoint: 'getCrossInvolvementAnalysis',
      results: 'Loading...',
    },
    {
      title: 'Emergency Resource Allocation',
      code: `
      SELECT 
        es.service_type,
        COUNT(DISTINCT es.accident_id) as total_deployments,
        ROUND(AVG(es.response_time), 2) as avg_response_time,
        ROUND(
          COUNT(DISTINCT 
            CASE WHEN a.severity = 'severe' 
            THEN es.accident_id END
          ) / COUNT(DISTINCT es.accident_id) * 100,
          2
        ) as severe_accident_response_percentage,
        ROUND(
          COUNT(DISTINCT 
            CASE WHEN es.response_time > 30 
            THEN es.accident_id END
          ) / COUNT(DISTINCT es.accident_id) * 100,
          2
        ) as delayed_response_percentage,
        ROUND(
          (
            SELECT COUNT(DISTINCT accident_id) 
            FROM EmergencyServices 
            WHERE service_type = es.service_type
          ) / 
          (SELECT COUNT(DISTINCT accident_id) FROM Accidents) * 100,
          2
        ) as overall_coverage_percentage
      FROM EmergencyServices es
      JOIN Accidents a ON es.accident_id = a.accident_id
      GROUP BY es.service_type
      ORDER BY total_deployments DESC
      `,
      description: 'Comprehensive analysis of emergency resource allocation, including response times and coverage.',
      apiEndpoint: 'getEmergencyResourceAllocation',
      results: 'Loading...',
    },
  ];

  const [queryResults, setQueryResults] = useState(queries);

  useEffect(() => {
    const fetchResults = async () => {
      const updatedQueries = await Promise.all(
        queries.map(async query => {
          try {
            const response = await axios.get(`http://localhost:3001/api/query/${query.apiEndpoint}`);
            return { ...query, results: JSON.stringify(response.data, null, 2) };
          } catch (error) {
            console.error(`Error fetching results for ${query.title}:`, error);
            return { ...query, results: `Error fetching results for ${query.apiEndpoint}` };
          }
        })
      );
      setQueryResults(updatedQueries);
    };

    fetchResults();
  }, []);

  const [areAllExpanded, setAreAllExpanded] = useState(false);

  const toggleExpandAll = () => {
    setAreAllExpanded(!areAllExpanded);
  };

  return (
    <section id="Queries" className="py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-primary text-center mb-12">SQL Queries</h2>

        {/* Collapse/Expand All Buttons */}
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleExpandAll}
            className="bg-secondary text-white py-2 px-6 rounded-md flex items-center gap-2"
          >
            <i className={`bx ${areAllExpanded ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
            {areAllExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <div className="space-y-8">
          {queryResults.map((query, index) => (
            <QueryRow
              key={index}
              title={query.title}
              description={query.description}
              code={query.code}
              results={query.results}
              isExpanded={areAllExpanded} // Pass the global state to each row
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const QueryRow = ({ title, description, code, results, isExpanded }) => {
  const [isRowExpanded, setIsRowExpanded] = useState(isExpanded);

  // Synchronize row expansion state with global expand/collapse state
  React.useEffect(() => {
    setIsRowExpanded(isExpanded);
  }, [isExpanded]);

  const handleToggleExpand = () => {
    setIsRowExpanded(!isRowExpanded);
  };

  return (
    <div className="bg-secondary shadow-lg rounded-lg">
      {/* Make the header container clickable */}
      <div
        onClick={handleToggleExpand}
        className="flex justify-between items-center px-6 py-4 border-b border-gray-800 cursor-pointer"
        role="button"
        aria-expanded={isRowExpanded}
        aria-label={`Toggle ${title}`}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <i className={`bx ${isRowExpanded ? 'bx-chevron-up' : 'bx-chevron-down'} text-xl`}></i>
      </div>
      {isRowExpanded && (
        <div className="px-6 py-4 space-y-6">
          <div>
            <p className="text-sm text-gray-400 mb-4">{description}</p>
            <h4 className="text-md font-medium mb-2">SQL Code:</h4>
            <pre className="bg-primary p-4 rounded-lg text-sm overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
          <div>
            <h4 className="text-md font-medium mb-2">Results:</h4>
            <pre className="bg-primary p-4 rounded-lg text-sm overflow-x-auto">
              <code>{results}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueriesSection;
