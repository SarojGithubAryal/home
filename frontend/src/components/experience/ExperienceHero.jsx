/**
 * ExperienceHero.jsx
 *
 * Shared hero/header for the four Experience List pages (Hear, Read,
 * See, Memory). Architecturally mirrors RoomPage's hero exactly: an
 * absolutely-positioned background layer (theme image + warm scrim)
 * with header/title/quote/stats content sitting above it, so every
 * Experience page reads as ONE continuous surface with the page's own
 * content panel beneath it — never a separate white hero card stacked
 * on top of another container. This is the single reusable component
 * all four pages now consume instead of each maintaining its own
 * duplicated *Header internal component.
 *
 * Per Phase 1 scope: this component only wires backend data through —
 * pageQuote, stats, greeting — with graceful hide-if-absent behavior.
 * No new visual design beyond what's needed to render these fields at
 * all; glass treatments, fine spacing, and motion polish are Phase 2.
 *
 * Every value rendered here comes from props supplied by the calling
 * page. This component invents no content and hardcodes no labels
 * beyond structural chrome (back-button glyph), matching the same
 * precedent already established in RoomPage.
 */

import React from 'react';
import IconButton from '../common/IconButton';
import OrnamentDivider from '../common/OrnamentDivider';
import AssetRegistry from '../../assets/AssetRegistry';
import { classNames } from '../../utils/helpers';
import './ExperienceHero.css';

function ExperienceHero({
    icon,
    iconImage,
    title,
    subtitle,
    greeting,
    pageQuote,
    stats,
    onBack,
    onBookmark,
    onMore,
    className,
}) {

    const statList = Array.isArray(stats) ? stats : [];

    return (
        <div className={classNames('experience-hero', className)}>
            <div className="experience-hero-top">
                <IconButton icon="←" ariaLabel="Go back" onClick={onBack} />

                <div className="experience-hero-top-right">
                    {iconImage ? (
                        <span className="experience-hero-icon-badge" aria-hidden="true">
                            <img src={iconImage} alt="" className="experience-hero-icon-image" />
                        </span>
                    ) : icon ? (
                        <span className="experience-hero-icon-badge" aria-hidden="true">
                            {icon}
                        </span>
                    ) : null}

                    <IconButton icon="🔖" ariaLabel="Bookmark" onClick={onBookmark} />
                    <IconButton icon="⋯" ariaLabel="More options" onClick={onMore} />
                </div>
            </div>

            <div className="experience-hero-overlay">
                <div className="experience-hero-content">
                    {greeting && (
                        <p className="experience-hero-greeting">
                            {typeof greeting === 'string' ? greeting : greeting.text}
                        </p>
                    )}

                    {title && <h1 className="experience-hero-title">{title}</h1>}
                    {subtitle && <p className="experience-hero-subtitle">{subtitle}</p>}

                    {pageQuote && (
                        <div className="experience-hero-quote-block">
                            <OrnamentDivider mark="♥" />

                            <p className="experience-hero-quote">
                                {typeof pageQuote === 'string'
                                    ? pageQuote
                                    : pageQuote.text}
                            </p>

                            {typeof pageQuote === 'object' && pageQuote.author && (
                                <p className="experience-hero-quote-author">
                                    — {pageQuote.author}
                                </p>
                            )}
                        </div>
                    )}
                    {statList.length > 0 && (
                        <div className="experience-hero-stats">
                            {statList.map((stat) => {
                                const statIcon = AssetRegistry.getStatIcon(stat.iconKey);
                                return (
                                    <div key={stat.id} className="experience-hero-stat">
                                        {statIcon && (
                                            <img
                                                src={statIcon}
                                                alt=""
                                                className="experience-hero-stat-icon"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <span className="experience-hero-stat-value">{stat.value}</span>
                                        {stat.label && (
                                            <span className="experience-hero-stat-label">{stat.label}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExperienceHero;