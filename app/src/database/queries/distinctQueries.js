import { db } from '../db.js';

// 1. Identify the most dangerous locations with the highest number of severe accidents
async function getMostDangerousLocations() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 2. Calculate emergency service efficiency by different service types
async function getEmergencyServiceEfficiency() {
  const [results] = await db.query(`
      SELECT 
        service_type, 
        COUNT(*) as total_responses,
        ROUND(AVG(response_time), 2) as avg_response_time,
        ROUND(MIN(response_time), 2) as min_response_time,
        ROUND(MAX(response_time), 2) as max_response_time
      FROM EmergencyServices
      GROUP BY service_type
      ORDER BY avg_response_time
    `);
  return results;
}

// 3. Analyze user involvement patterns across different accident severities
async function getUserInvolvementBySeverity() {
  const [results] = await db.query(`
      SELECT 
        ua.involvement_type,
        a.severity,
        COUNT(*) as involvement_count,
        ROUND(COUNT(*) / (SELECT COUNT(*) FROM UserAccidents) * 100, 2) as percentage
      FROM UserAccidents ua
      JOIN Accidents a ON ua.accident_id = a.accident_id
      GROUP BY ua.involvement_type, a.severity
      ORDER BY involvement_count DESC
    `);
  return results;
}

// 4. Identify seasonal accident trends
async function getSeasonalAccidentTrends() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 5. Analyze time distribution of accidents
async function getAccidentTimeDistribution() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 6. Compare emergency service response across different user roles
async function getResponseTimeByUserRole() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 7. Analyze geographical spread of accidents
async function getAccidentGeographicalSpread() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 8. Identify most frequent accident causes
async function getMostFrequentAccidentCauses() {
  const [results] = await db.query(`
      SELECT 
        SUBSTRING_INDEX(SUBSTRING_INDEX(description, 'due to', -1), '.', 1) as cause,
        COUNT(*) as occurrence_count,
        ROUND(COUNT(*) / (SELECT COUNT(*) FROM Accidents) * 100, 2) as percentage
      FROM Accidents
      GROUP BY cause
      ORDER BY occurrence_count DESC
      LIMIT 10
    `);
  return results;
}

// 9. Calculate user reporting patterns
async function getUserReportingPatterns() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 10. Analyze intersection complexity
async function getIntersectionComplexity() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 11. Track emergency service deployment patterns
async function getEmergencyServiceDeployment() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 12. Analyze temporal accident escalation
async function getAccidentEscalationTrends() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 13. Identify high-risk user groups
async function getHighRiskUserGroups() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 14. Calculate location vulnerability index
async function getLocationVulnerabilityIndex() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 15. Track multi-service accident responses
async function getMultiServiceAccidents() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 16. Analyze Cost Impact of Accidents
async function getAccidentCostAnalysis() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 17. Analyze User Fatigue and Accident Involvement
async function getUserFatigueAnalysis() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 18. Analyze Accident Communication and Reporting Efficiency
async function getAccidentReportingEfficiency() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 19. Analyze Cross-Involvement in Multiple Accidents
async function getCrossInvolvementAnalysis() {
  const [results] = await db.query(`
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
    `);
  return results;
}

// 20. Comprehensive Emergency Resource Allocation Analysis
async function getEmergencyResourceAllocation() {
  const [results] = await db.query(`
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
    `);
  return results;
}

export {
  getMostDangerousLocations,
  getEmergencyServiceEfficiency,
  getUserInvolvementBySeverity,
  getSeasonalAccidentTrends,
  getAccidentTimeDistribution,
  getResponseTimeByUserRole,
  getAccidentGeographicalSpread,
  getMostFrequentAccidentCauses,
  getUserReportingPatterns,
  getIntersectionComplexity,
  getEmergencyServiceDeployment,
  getAccidentEscalationTrends,
  getHighRiskUserGroups,
  getLocationVulnerabilityIndex,
  getMultiServiceAccidents,
  getAccidentCostAnalysis,
  getUserFatigueAnalysis,
  getAccidentReportingEfficiency,
  getCrossInvolvementAnalysis,
  getEmergencyResourceAllocation,
};
