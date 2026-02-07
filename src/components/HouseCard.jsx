import React from 'react';
import { motion } from 'framer-motion';

const HouseCard = ({ house, onClick, isSelected, style, onMouseEnter, onMouseLeave }) => {
    return (
        <motion.div
            className={`glass-panel`}
            style={{
                ...style,
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{house.address}</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(148, 163, 184, 0.2)', color: 'var(--color-text-main)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                    {house.dietPreference}
                </span>
                <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                    {house.residents.length} Residents
                </span>
                <span style={{ fontSize: '12px', background: 'var(--color-surface)', padding: '4px 8px', borderRadius: '4px' }}>
                    {house.street}
                </span>

                <span style={{ fontSize: '12px', background: 'var(--color-surface)', padding: '4px 8px', borderRadius: '4px' }}>
                    {house.lookingForRoommates ? `Looking for ${house.roommatePreference}` : 'Not looking'}
                </span>
            </div>
        </motion.div>
    );
};

export default HouseCard;
