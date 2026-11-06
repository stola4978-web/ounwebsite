
const themeBtn = document.getElementById("themeBtn");
const bgVideo = document.getElementById("bgVideo");
const overlay = document.querySelector(".overlay");
const portfolioText = document.querySelector(".portfolio-text");

const lightVideo = "video_2026-11-05_09-34-54.mp4";
const darkVideo = "video_2026-11-05_11-09-09.mp4";

let isDark = false;

function setVideo(src) {
    bgVideo.src = src;
    bgVideo.load();
    bgVideo.play().catch(() => {});
}


// Initial Light Mode
setVideo(lightVideo);
portfolioText.classList.add("light-mode");

themeBtn.addEventListener("click", () => {
    isDark = !isDark;

    if (isDark) {
        // Dark Mode
        setVideo(darkVideo);
        overlay.classList.add("active");
        themeBtn.classList.add("dark");

        portfolioText.classList.remove("light-mode");

    } else {
        // Light Mode
        setVideo(lightVideo);
        overlay.classList.remove("active");
        themeBtn.classList.remove("dark");

        portfolioText.classList.add("light-mode");
    }
});


// ---------- Scroll reveal ----------
const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

// ---------- Active nav link ពេល scroll ----------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        }
    });
}, { threshold: 0.5 });


// ---------- Marquee: scroll ដោយដៃ + loop (ប្រើបានច្រើនកន្លែង) ----------
function setupMarquee(marquee) {
    const half = () => marquee.scrollWidth / 2;

    // ចាប់ផ្តើមពីកណ្តាល ដើម្បីអូសទៅឆ្វេងបានដែរ
    window.addEventListener("load", () => {
        marquee.scrollLeft = half();
    });

    // ដល់ចុង → លោតទៅដើមវិញ (មើលមិនឃើញ ព្រោះ 2 ជុំដូចគ្នា)
  // ដល់ចុង → លោតទៅដើមវិញ (មើលមិនឃើញ ព្រោះ 2 ជុំដូចគ្នា)
marquee.addEventListener("scroll", () => {
    const h = half();
    if (marquee.scrollLeft >= h + 1) marquee.scrollLeft -= h;
    else if (marquee.scrollLeft < 1) marquee.scrollLeft += h;
});
    // កង់កណ្តុរ (បិទបានដោយ data-wheel="off")
    if (marquee.dataset.wheel !== "off") {
        marquee.addEventListener("wheel", (e) => {
            e.preventDefault();
            marquee.scrollLeft += e.deltaY + e.deltaX;
        }, { passive: false });
    } else {
        // ប្រអប់ gallery: ប្រើ Shift + កង់ ឬ trackpad ផ្ដេក
        marquee.addEventListener("wheel", (e) => {
            if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                marquee.scrollLeft += e.deltaX || e.deltaY;
            }
        }, { passive: false });
    }

    // ចុចអូសដោយកណ្តុរ
    let isDown = false;
    let moved = false;
    let lastX = 0;

    marquee.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch") return;
        isDown = true;
        moved = false;
        lastX = e.clientX;
    });

    window.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const dx = e.clientX - lastX;
        if (Math.abs(dx) > 0) moved = true;
        marquee.classList.add("dragging");
        marquee.scrollLeft -= dx;
        lastX = e.clientX;
    });

    window.addEventListener("pointerup", () => {
        isDown = false;
        marquee.classList.remove("dragging");
    });

    // បើទើបអូស កុំឲ្យចុចចូល link
    marquee.addEventListener("click", (e) => {
        if (moved) {
            e.preventDefault();
            moved = false;
        }
    }, true);

    marquee.addEventListener("dragstart", (e) => e.preventDefault());
}

// ==================== AI Chat ====================
const CHAT_API = "https://YOUR-WORKER.YOUR-NAME.workers.dev";

const chatBox = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const chatHistory = [];

function addMsg(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div;
}

async function sendMessage(text) {
    text = text.trim();
    if (!text) return;

    addMsg(text, "user");
    chatHistory.push({ role: "user", parts: [{ text }] });
    chatInput.value = "";
    chatSend.disabled = true;

    const typing = addMsg("កំពុងគិត...", "bot typing");

    try {
        const res = await fetch(CHAT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory }),
        });
        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();
        typing.remove();
        addMsg(data.reply, "bot");
        chatHistory.push({ role: "model", parts: [{ text: data.reply }] });
    } catch (err) {
        console.error("Chat error:", err);
        typing.remove();
        chatHistory.pop();   // ដកសារ user ដែលបរាជ័យចេញ
        addMsg("មានបញ្ហាក្នុងការតភ្ជាប់ សូមសាកម្តងទៀត។", "bot");
    }

    chatSend.disabled = false;
    chatInput.focus();
}

chatSend.addEventListener("click", () => sendMessage(chatInput.value));
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(chatInput.value);
});

document.querySelectorAll(".chat-suggest button").forEach((btn) => {
    btn.addEventListener("click", () => sendMessage(btn.textContent));
});
function playVideo() {

    const box = document.querySelector(".video-card");
    const video = document.getElementById("previewVideo");

    box.classList.add("playing");

    video.play().catch(error => {
        console.log("Video Error:", error);
    });

}
document.querySelectorAll(".marquee").forEach(setupMarquee);