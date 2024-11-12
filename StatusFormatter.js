class StatusFormatter {
    static formatResponseTime(time) {
        return `${time}ms`;
    }

    static getStatusEmoji(status) {
        if (!status) return '🟢';
        switch(status.toUpperCase()) {
            case 'UP': return '🟢';
            case 'SLOW': return '🟡';
            default: return '⭕';
        }
    }

    static getRegionData(data, path, region, defaultResponseTime = 15) {
        try {
            const pathParts = path.split('.');
            let currentData = data;
            
            for (const part of pathParts) {
                currentData = currentData?.[part];
            }

            const regionData = currentData?.[region];
            
            if (!regionData) {
                return { Status: 'UP', ResponseTime: defaultResponseTime };
            }

            return {
                Status: regionData.Status || 'UP',
                ResponseTime: regionData.ResponseTime || defaultResponseTime
            };
        } catch (error) {
            return { Status: 'UP', ResponseTime: defaultResponseTime };
        }
    }

    static formatRegionData(regions, data, serviceName1, serviceName2, defaultTimes = [15, 2]) {
        let service1Value = '';
        let service2Value = '';

        regions.forEach(region => {
            const stats1 = this.getRegionData(data, serviceName1, region, defaultTimes[0]);
            const stats2 = this.getRegionData(data, serviceName2, region, defaultTimes[1]);

            service1Value += `${this.getStatusEmoji(stats1.Status)} ${region}: ${this.formatResponseTime(stats1.ResponseTime)}\n`;
            service2Value += `${this.getStatusEmoji(stats2.Status)} ${region}: ${this.formatResponseTime(stats2.ResponseTime)}\n`;
        });

        return [service1Value, service2Value];
    }

    static formatPredatorData(predatorData) {
        if (!predatorData) return 'No data available';

        const rpData = predatorData.RP;
        if (!rpData) return 'No data available';

        // Helper function to format numbers with commas
        const formatNumber = (num) => {
            return num?.toLocaleString() || 'N/A';
        };

        // Helper function to get RP value
        const getRP = (platform) => {
            if (!platform) return 'N/A';
            return formatNumber(platform.val);
        };

        // Helper function to get player count
        const getPlayerCount = (platform) => {
            if (!platform) return 'N/A';
            return formatNumber(platform.totalMastersAndPreds);
        };

        // Platform icons
        const icons = {
            PC: '🖥️',
            PS4: '🎮',
            X1: '🟩',
            SWITCH: '🔄'
        };

        // Helper function to format a platform line
        const formatPlatformLine = (platformKey, name) => {
            const platform = rpData[platformKey];
            const rp = getRP(platform);
            const count = getPlayerCount(platform);
            return `${icons[platformKey]} **${name}**\n┗ Threshold: \`${rp} RP\`  •  Players: \`${count}\``;
        };

        // Combine all platforms with spacing
        return [
            formatPlatformLine('PC', 'PC (Steam / EA App)'),
            formatPlatformLine('PS4', 'PlayStation'),
            formatPlatformLine('X1', 'Xbox'),
            formatPlatformLine('SWITCH', 'Switch')
        ].join('\n\n');
    }

    static formatServerStatus(data, embed, predatorData) {
        try {
            // Regions configuration
            const regions = [
                'US-East', 'US-Central', 'US-West',
                'EU-East', 'EU-West', 'South-America', 'Asia'
            ];

            // [Crossplay] Apex Login and EA Login
            const [crossplayValue, eaLoginValue] = this.formatRegionData(
                regions, data, 'EA_novafusion', 'EA_login', [15, 2]
            );

            embed.addFields([ 
                { name: '[Crossplay] Apex Login', value: crossplayValue || 'No data', inline: true },
                { name: 'EA Login', value: eaLoginValue || 'No data', inline: true }
            ]);

            // Add empty field for spacing
            embed.addFields({ name: '\u200B', value: '\u200B', inline: false });

            // EA Accounts and Matchmaking Services
            const [accountsValue, matchmakingValue] = this.formatRegionData(
                regions, data, 'EA_accounts', 'ApexOauth.Crossplay', [15, 15]
            );

            embed.addFields([ 
                { name: 'EA Accounts', value: accountsValue || 'No data', inline: true },
                { name: 'Lobby & Matchmaking Services', value: matchmakingValue || 'No data', inline: true }
            ]); 

            // Add empty field for spacing
            embed.addFields({ name: '\u200B', value: '\u200B', inline: false });

            // Add Predator data to embed
            const formattedPredatorData = this.formatPredatorData(predatorData);
            embed.addFields({
                name: 'Apex Predator Ranked Point Threshold',
                value: formattedPredatorData,
                inline: false
            });

            // Add footer with credit
            embed.setFooter({ 
                text: 'Status data provided by https://apexlegendsstatus.com/'
            });
            
            return { embeds: [embed] };

        } catch (error) {
            console.error('Error formatting server status:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('Error')
                .setDescription('⚠️ Error retrieving server status. Please try again later.\nIf this persists, please report this issue.')
                .setTimestamp();

            return { embeds: [errorEmbed] };
        }
    }
}

module.exports = StatusFormatter;
