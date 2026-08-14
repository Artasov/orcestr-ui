'use client';

import { useState, type ReactNode } from 'react';
import { LuArrowRight, LuBoxes, LuChartNoAxesCombined, LuSparkles } from 'react-icons/lu';

import { Badge, Button, Carousel, Flex, Stack, Text } from '../index.js';
import { ExampleTile } from './CodePreview.js';
import { codeSamples, type CodeExample } from './codeSamples.js';
import { UiExampleSection } from './UiExampleSection.js';

type CarouselSectionProps = { onOpenCode: (example: CodeExample) => void };
const controlledSlides = ['Discovery', 'Delivery', 'Evolution'];

function RichSlide({
    eyebrow,
    title,
    description,
    icon,
    tone,
}: {
    eyebrow: string;
    title: string;
    description: string;
    icon: ReactNode;
    tone: 'violet' | 'blue' | 'rose';
}) {
    return (
        <div className="oui-ui-carousel-slide" data-tone={tone}>
            <div className="oui-ui-carousel-slide-icon">{icon}</div>
            <Stack g={2} className="oui-ui-carousel-slide-copy">
                <Text
                    fs="11px"
                    fw={760}
                    tone="muted"
                    style={{ textTransform: 'uppercase', letterSpacing: '.1em' }}
                >
                    {eyebrow}
                </Text>
                <Text as="h3" fs="clamp(23px, 3vw, 36px)" fw={650} lh={1.12}>
                    {title}
                </Text>
                <Text tone="muted" lh={1.55} className="oui-ui-carousel-slide-description">
                    {description}
                </Text>
                <Button className="oui-ui-carousel-slide-action" v="soft" size={2}>
                    Explore capability <LuArrowRight aria-hidden="true" />
                </Button>
            </Stack>
        </div>
    );
}

export function CarouselSection({ onOpenCode }: CarouselSectionProps) {
    const [controlledIndex, setControlledIndex] = useState(0);
    return (
        <UiExampleSection
            id="carousel-example"
            title="Carousel"
            description="Flexible slides with optional navigation, autoplay, keyboard control and touch gestures."
        >
            <div className="oui-ui-grid">
                <ExampleTile
                    title="Rich content carousel"
                    code={codeSamples.carousel}
                    onOpen={onOpenCode}
                >
                    <Carousel
                        className="oui-ui-carousel-demo"
                        arrows="hover"
                        showDots
                        aria-label="Product capabilities"
                    >
                        <RichSlide
                            eyebrow="01 / Product"
                            title="Content is not limited to images"
                            description="Compose each slide from headings, controls, forms, media or any other React content."
                            icon={<LuBoxes />}
                            tone="violet"
                        />
                        <RichSlide
                            eyebrow="02 / Insight"
                            title="Navigation stays out of the way"
                            description="Keep arrows visible, reveal them on hover, or remove them entirely for a controlled experience."
                            icon={<LuChartNoAxesCombined />}
                            tone="blue"
                        />
                        <RichSlide
                            eyebrow="03 / Motion"
                            title="Smooth, accessible rotation"
                            description="Autoplay pauses during interaction and respects the user's reduced-motion preference."
                            icon={<LuSparkles />}
                            tone="rose"
                        />
                    </Carousel>
                </ExampleTile>

                <ExampleTile
                    title="Autoplay carousel"
                    code={codeSamples.carouselAutoplay}
                    onOpen={onOpenCode}
                >
                    <Carousel
                        className="oui-ui-carousel-compact"
                        arrows="always"
                        arrowSize={1}
                        autoplay
                        autoplayInterval={3200}
                        pauseOnHover
                        showAutoplayControl
                        aria-label="Automatic status highlights"
                    >
                        {['Live workspace', 'Shared decisions', 'Visible progress'].map(
                            (title, index) => (
                                <div key={title} className="oui-ui-carousel-status">
                                    <Badge tone={index === 1 ? 'success' : 'primary'}>
                                        {String(index + 1).padStart(2, '0')}
                                    </Badge>
                                    <Text fs="22px" fw={680}>
                                        {title}
                                    </Text>
                                    <Text tone="muted">
                                        Pause, navigate manually, or let the carousel continue.
                                    </Text>
                                </div>
                            ),
                        )}
                    </Carousel>
                </ExampleTile>

                <ExampleTile
                    title="Controlled minimal carousel"
                    code={codeSamples.carouselControlled}
                    onOpen={onOpenCode}
                >
                    <Carousel
                        className="oui-ui-carousel-minimal"
                        value={controlledIndex}
                        onValueChange={setControlledIndex}
                        arrows="never"
                        showDots={false}
                        loop={false}
                        aria-label="Controlled delivery stages"
                    >
                        {controlledSlides.map((title, index) => (
                            <div key={title} className="oui-ui-carousel-minimal-slide">
                                <Text tone="muted">Stage {index + 1}</Text>
                                <Text fs="28px" fw={680}>
                                    {title}
                                </Text>
                            </div>
                        ))}
                    </Carousel>
                    <Flex g={2} a="c" j="sb" wrap>
                        <Text tone="muted">
                            {controlledIndex + 1} / {controlledSlides.length}
                        </Text>
                        <Flex g={2}>
                            <Button
                                v="soft"
                                disabled={controlledIndex === 0}
                                onClick={() => setControlledIndex((current) => current - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                disabled={controlledIndex === controlledSlides.length - 1}
                                onClick={() => setControlledIndex((current) => current + 1)}
                            >
                                Next
                            </Button>
                        </Flex>
                    </Flex>
                </ExampleTile>
            </div>
        </UiExampleSection>
    );
}
