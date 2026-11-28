import { Code } from './code';
import { Reveal } from './reveal';
import { Section } from './section';
import { CodeCard, StatusList, type StatusItem } from './status-list';

const facts = [
  ['~85 KB', 'a typical Vex program, with its runtime'],
  ['No VM', 'one native executable, nothing to install on the board'],
  ['C inside', 'vendor SDKs and drivers are C, called directly'],
  ['ARM64', 'the runtime already runs on 64-bit ARM'],
];

const steps: StatusItem[] = [
  { title: 'Raspberry Pi and Linux boards', detail: 'Cross builds for arm64 and armv7 from your Mac or PC, and an SDK for the board', status: 'Planned' },
  { title: 'Pins, buses and serial', detail: 'GPIO with edge events as streams, PWM, I²C, SPI and serial ports', status: 'Planned' },
  { title: 'Talk to the network', detail: 'An MQTT client with TLS, plus HTTP and WebSocket from the app phase', status: 'Planned' },
  { title: 'Deploy to the board', detail: 'vex deploy copies a build over SSH, runs it and streams its output', status: 'Planned' },
  { title: 'Microcontrollers', detail: 'A freestanding runtime on RP2040 or ESP32-C3, starting with a spike', status: 'Spike' },
];

const sample = `import "vex:gpio"
import "package:mqtt"

async fn main() throws {
    let door = try gpio.pin(17, mode: .input)
    let broker = try await mqtt.connect("mqtts://home.local")

    for await edge in door.edges() {
        let open = edge == .rising
        try await broker.publish("house/door/open", "{open}")
        println("door open: {open}")
    }
}`;

/// Where Vex goes after phones: single-board computers, sensors and microcontrollers.
export function Devices() {
  return (
    <Section
      eyebrow="Devices and IoT"
      title="From the phone to the sensor"
      sub="Native code with no VM and binaries under 100 KB suits small boards. The next phase brings Vex to the Raspberry Pi and its pins, sensors and networks, then to microcontrollers."
      action={{ label: 'See Phase 9 on the roadmap', href: '/roadmap#phase-9' }}
    >
      <Reveal className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(([value, note]) => (
          <div key={value} className="rounded-xl border border-fd-border bg-fd-card px-5 py-4">
            <p className="font-display text-[28px] text-fd-foreground">{value}</p>
            <p className="mt-1 text-sm text-fd-muted-foreground">{note}</p>
          </div>
        ))}
      </Reveal>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal className="min-w-0">
          <CodeCard file="door.vx" label="Planned API">
            <Code code={sample} className="px-5 py-4 text-[13px] leading-[23px]" />
          </CodeCard>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            A door sensor on pin 17 that reports to an MQTT broker. Async code and streams already work today; the gpio and mqtt modules are planned, so their names may change.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <StatusList items={steps} numbered />
          <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground">
            Built on the C interop steps: board vendors ship their SDKs as C, and Vex calls C directly.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
