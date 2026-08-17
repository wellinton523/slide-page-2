const canvasHost = document.getElementById('canva');

if (canvasHost) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let particles = [];
    let leaves = [];
    let molecules = [];
    let orbs = [];
    let nebulae = [];
    let shootingStars = [];
    let lastLiteState = document.body.classList.contains('shader-lite');

    function getShaderSettings() {
        const isLite = document.body.classList.contains('shader-lite');

        return {
            particleCount: isLite ? Math.max(60, Math.floor((width * height) / 3800)) : Math.max(170, Math.floor((width * height) / 1700)),
            leafCount: 28,
            moleculeCount: 14,
            orbCount: isLite ? 2 : 3,
            shootingStarCount: isLite ? 0 : 5,
            glowStrength: isLite ? 0.45 : 0.8,
            shimmerOpacity: isLite ? 0.002 : 0.01,
            particleSpeed: isLite ? 0.6 : 1
        };
    }

    function createParticles() {
        const settings = getShaderSettings();
        particles = Array.from({ length: settings.particleCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.2,
            vx: (Math.random() - 0.5) * (0.16 + Math.random() * 0.08) * settings.particleSpeed,
            vy: (Math.random() - 0.5) * (0.16 + Math.random() * 0.08) * settings.particleSpeed,
            alpha: Math.random() * 0.35 + 0.12,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.001 + Math.random() * 0.003,
            sizeFactor: Math.random() > 0.92 ? 2.8 : 1,
            drift: (Math.random() - 0.5) * 0.08,
            type: Math.random() > 0.92 ? 'star' : 'dust'
        }));
    }

    function createLeaves() {
        const settings = getShaderSettings();
        leaves = Array.from({ length: settings.leafCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: 6 + Math.random() * 10,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.03,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.4 + Math.random() * 0.8,
            oscillation: Math.random() * Math.PI * 2,
            oscSpeed: 0.01 + Math.random() * 0.02
        }));
    }

    function createMolecules() {
        const settings = getShaderSettings();
        molecules = Array.from({ length: settings.moleculeCount }, () => {
            const atomCount = 3 + Math.floor(Math.random() * 3);
            const atoms = [];
            for (let i = 0; i < atomCount; i++) {
                atoms.push({
                    ox: (Math.random() - 0.5) * 35,
                    oy: (Math.random() - 0.5) * 35,
                    radius: 3 + Math.random() * 4
                });
            }
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.005,
                atoms: atoms
            };
        });
    }

    function createOrbs() {
        const settings = getShaderSettings();
        orbs = Array.from({ length: settings.orbCount }, (_, index) => ({
            x: width * (0.18 + index * 0.16),
            y: height * (0.2 + (index % 3) * 0.2),
            radius: 110 + index * 35,
            offset: Math.random() * Math.PI * 2,
            speed: 0.0004 + index * 0.00008
        }));
    }

    function getThemePalette() {
        const isBella = document.body.classList.contains('theme-bella');
        const isNature = document.body.classList.contains('theme-nature') || document.body.classList.contains('theme-verde');

        if (isBella) {
            return {
                backgroundTop: '#060402',
                backgroundMid: '#140c08',
                backgroundBottom: '#22140e',
                nebulaOne: 'rgba(168, 96, 33, 0.22)',
                nebulaTwo: 'rgba(85, 55, 24, 0.16)',
                nebulaThree: 'rgba(170, 118, 56, 0.16)',
                shimmer: 'rgba(255, 230, 196, 0.05)',
                orbGlow: 'rgba(255, 185, 90, 0.18)',
                particleGlow: 'rgba(255, 236, 203, 0.6)',
                particleSecondary: 'rgba(228, 176, 100, 0.16)',
                starTrail: 'rgba(255, 228, 180, 0.4)',
                leafFill: 'rgba(212, 143, 56, 0.4)',
                leafStroke: 'rgba(255, 196, 112, 0.7)',
                chemBond: 'rgba(242, 166, 90, 0.25)',
                chemAtom: 'rgba(255, 200, 130, 0.6)'
            };
        }

        if (isNature) {
            return {
                backgroundTop: '#020d07',
                backgroundMid: '#061a10',
                backgroundBottom: '#010804',
                nebulaOne: 'rgba(16, 185, 129, 0.18)',
                nebulaTwo: 'rgba(52, 211, 153, 0.14)',
                nebulaThree: 'rgba(5, 150, 105, 0.16)',
                shimmer: 'rgba(209, 250, 229, 0.03)',
                orbGlow: 'rgba(52, 211, 153, 0.2)',
                particleGlow: 'rgba(167, 243, 208, 0.65)',
                particleSecondary: 'rgba(110, 231, 183, 0.2)',
                starTrail: 'rgba(167, 243, 208, 0.35)',
                leafFill: 'rgba(16, 185, 129, 0.35)',
                leafStroke: 'rgba(110, 231, 183, 0.75)',
                chemBond: 'rgba(52, 211, 153, 0.3)',
                chemAtom: 'rgba(167, 243, 208, 0.7)'
            };
        }

        return {
            backgroundTop: '#01030a',
            backgroundMid: '#07111f',
            backgroundBottom: '#02050a',
            nebulaOne: 'rgba(80, 39, 255, 0.18)',
            nebulaTwo: 'rgba(0, 196, 255, 0.14)',
            nebulaThree: 'rgba(174, 64, 255, 0.16)',
            shimmer: 'rgba(255, 255, 255, 0.03)',
            orbGlow: 'rgba(122, 245, 255, 0.16)',
            particleGlow: 'rgba(210, 240, 255, 0.55)',
            particleSecondary: 'rgba(160, 190, 255, 0.14)',
            starTrail: 'rgba(255, 255, 255, 0.33)',
            leafFill: 'rgba(0, 196, 255, 0.25)',
            leafStroke: 'rgba(122, 245, 255, 0.5)',
            chemBond: 'rgba(0, 196, 255, 0.2)',
            chemAtom: 'rgba(210, 240, 255, 0.5)'
        };
    }

    function createNebulae() {
        const palette = getThemePalette();
        nebulae = [
            { x: width * 0.25, y: height * 0.25, radius: width * 0.32, color: palette.nebulaOne },
            { x: width * 0.77, y: height * 0.22, radius: width * 0.28, color: palette.nebulaTwo },
            { x: width * 0.55, y: height * 0.8, radius: width * 0.24, color: palette.nebulaThree }
        ];
    }

    function createShootingStars() {
        const settings = getShaderSettings();
        shootingStars = Array.from({ length: settings.shootingStarCount }, () => ({
            x: Math.random() * width * 1.2 - width * 0.1,
            y: Math.random() * height,
            length: 80 + Math.random() * 120,
            vx: 4 + Math.random() * 4,
            vy: 0.6 + Math.random() * 1.2,
            alpha: 0,
            life: Math.random() * 120 + 70,
            timer: 0
        }));
    }

    function refreshShaderScene() {
        createParticles();
        createLeaves();
        createMolecules();
        createOrbs();
        createNebulae();
        createShootingStars();
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        refreshShaderScene();
    }

    function drawBackground(time) {
        const palette = getThemePalette();
        const settings = getShaderSettings();
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, palette.backgroundTop);
        gradient.addColorStop(0.45, palette.backgroundMid);
        gradient.addColorStop(1, palette.backgroundBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = settings.glowStrength;
        nebulae.forEach((nebula, index) => {
            const offsetX = Math.sin(time * 0.00017 + index * 1.2) * 20;
            const offsetY = Math.cos(time * 0.00014 + index * 0.9) * 16;
            const glow = ctx.createRadialGradient(nebula.x + offsetX, nebula.y + offsetY, 0, nebula.x + offsetX, nebula.y + offsetY, nebula.radius);
            glow.addColorStop(0, nebula.color);
            glow.addColorStop(0.3, 'rgba(255,255,255,0.08)');
            glow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);
        });
        ctx.restore();

        const shimmer = Math.sin(time * 0.00045) * settings.shimmerOpacity + settings.shimmerOpacity;
        ctx.fillStyle = `rgba(255, 255, 255, ${shimmer})`;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = palette.shimmer;
        ctx.fillRect(0, 0, width, height);
    }

    function drawOrbs(time) {
        const palette = getThemePalette();

        orbs.forEach((orb, index) => {
            const pulse = 0.75 + Math.sin(time * 0.0003 + orb.offset) * 0.2;
            const x = width * (0.14 + index * 0.17) + Math.sin(time * 0.00018 + index) * width * 0.06;
            const y = height * (0.18 + (index % 3) * 0.2) + Math.cos(time * 0.00016 + orb.offset) * height * 0.06;

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radius * 2.3);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${0.04 * pulse})`);
            gradient.addColorStop(0.25, `rgba(255, 255, 255, ${0.02 * pulse})`);
            gradient.addColorStop(0.6, palette.orbGlow);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, orb.radius * 2.3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function isSlideEffectDisabled() {
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) return false;
        
        // Verifica se o slide possui data-disable-decorations="true" ou classe 'no-decorations'
        return activeSlide.dataset.disableDecorations === 'true' || activeSlide.classList.contains('no-decorations');
    }

    function drawLeaves(time) {
        if (isSlideEffectDisabled()) return;
        const palette = getThemePalette();
        ctx.save();

        leaves.forEach((leaf) => {
            leaf.oscillation += leaf.oscSpeed;
            leaf.x += leaf.vx + Math.sin(leaf.oscillation) * 0.5;
            leaf.y += leaf.vy;
            leaf.angle += leaf.spin;

            if (leaf.y > height + 20) {
                leaf.y = -20;
                leaf.x = Math.random() * width;
            }

            ctx.save();
            ctx.translate(leaf.x, leaf.y);
            ctx.rotate(leaf.angle);

            ctx.beginPath();
            ctx.moveTo(0, -leaf.size);
            ctx.bezierCurveTo(leaf.size * 0.8, -leaf.size * 0.3, leaf.size * 0.8, leaf.size * 0.5, 0, leaf.size);
            ctx.bezierCurveTo(-leaf.size * 0.8, leaf.size * 0.5, -leaf.size * 0.8, -leaf.size * 0.3, 0, -leaf.size);
            
            ctx.fillStyle = palette.leafFill;
            ctx.fill();
            ctx.strokeStyle = palette.leafStroke;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, -leaf.size * 0.8);
            ctx.lineTo(0, leaf.size * 0.9);
            ctx.strokeStyle = palette.leafStroke;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.restore();
        });

        ctx.restore();
    }

    function drawMolecules(time) {
        if (isSlideEffectDisabled()) return;
        const palette = getThemePalette();
        ctx.save();

        molecules.forEach((mol) => {
            mol.x += mol.vx;
            mol.y += mol.vy;
            mol.rotation += mol.rotSpeed;

            if (mol.x < -40) mol.x = width + 40;
            if (mol.x > width + 40) mol.x = -40;

            ctx.save();
            ctx.translate(mol.x, mol.y);
            ctx.rotate(mol.rotation);

            ctx.strokeStyle = palette.chemBond;
            ctx.lineWidth = 1.2;
            for (let i = 0; i < mol.atoms.length; i++) {
                for (let j = i + 1; j < mol.atoms.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(mol.atoms[i].ox, mol.atoms[i].oy);
                    ctx.lineTo(mol.atoms[j].ox, mol.atoms[j].oy);
                    ctx.stroke();
                }
            }

            mol.atoms.forEach((atom) => {
                ctx.beginPath();
                ctx.arc(atom.ox, atom.oy, atom.radius, 0, Math.PI * 2);
                ctx.fillStyle = palette.chemAtom;
                ctx.fill();
                ctx.strokeStyle = palette.leafStroke;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            });

            ctx.restore();
        });

        ctx.restore();
    }

    function drawParticles(time) {
        const palette = getThemePalette();
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        particles.forEach((particle, index) => {
            particle.x += particle.vx + Math.sin(time * 0.00025 + index) * particle.drift;
            particle.y += particle.vy + Math.cos(time * 0.00018 + index) * particle.drift;

            if (particle.x < -18 || particle.x > width + 18) particle.x = Math.random() * width;
            if (particle.y < -18 || particle.y > height + 18) particle.y = Math.random() * height;

            const twinkle = 0.12 + Math.sin(time * particle.twinkleSpeed + particle.twinkle) * 0.8;
            const fade = Math.min(1, particle.alpha + twinkle * 0.22);
            const size = particle.radius * particle.sizeFactor;
            const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size * 3);

            gradient.addColorStop(0, `${palette.particleGlow}`);
            gradient.addColorStop(0.3, `${palette.particleSecondary}`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    function animate(time) {
        ctx.clearRect(0, 0, width, height);
        drawBackground(time);
        drawOrbs(time);
        drawMolecules(time);
        drawLeaves(time);
        drawParticles(time);
        requestAnimationFrame(animate);
    }

    const shaderStateObserver = new MutationObserver(() => {
        const isLite = document.body.classList.contains('shader-lite');
        if (isLite !== lastLiteState) {
            lastLiteState = isLite;
            refreshShaderScene();
        }
    });

    shaderStateObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    canvasHost.appendChild(canvas);
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);
}