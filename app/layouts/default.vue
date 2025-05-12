<script setup lang="ts">
import planomLogo from '@/assets/images/logo-white.png'
import {useChats} from '../composables/useChats.js'

import { LazyModalConfirm } from "#components";


const route = useRoute();
const toast = useToast();
const overlay = useOverlay();
const { loggedIn, openInPopup } = useUserSession();

const open = ref(false);

const deleteModal = overlay.create(LazyModalConfirm, {
  props: {
    title: "Delete chat",
    description:
      "Are you sure you want to delete this chat? This cannot be undone.",
  },
});

const { data: chats, refresh: refreshChats } = await useFetch("/api/chats", {
  key: "chats",
  transform: (data) =>
    data.map((chat) => ({
      id: chat.id,
      label: chat.title || "Untitled",
      to: `/chat/${chat.id}`,
      icon: "i-lucide-message-circle",
      createdAt: chat.createdAt,
    })),
});

onNuxtReady(async () => {
  const first10 = (chats.value || []).slice(0, 10);
  for (const chat of first10) {
    await $fetch(`/api/chats/${chat.id}`);
  }
});

watch(loggedIn, () => {
  refreshChats();
  open.value = false;
});

const { groups } = useChats(chats);

const items = computed(() =>
  groups.value?.flatMap((group) => {
    return [
      {
        label: group.label,
        type: "label" as const,
      },
      ...group.items.map((item) => ({
        ...item,
        slot: "chat" as const,
        icon: undefined,
        class: item.label === "Untitled" ? "text-muted" : "",
      })),
    ];
  })
);

async function deleteChat(id: string) {
  const instance = deleteModal.open();
  const result = await instance.result;
  if (!result) return;

  await $fetch(`/api/chats/${id}`, { method: "DELETE" });

  toast.add({
    title: "Chat deleted",
    description: "Your chat has been deleted",
    icon: "i-lucide-trash",
  });

  refreshChats();

  if (route.params.id === id) {
    navigateTo("/");
  }
}

defineShortcuts({
  c: () => {
    navigateTo("/");
  },
});
</script>

<template>
  <UDashboardGroup unit="rem" class="h-screen">
    <!-- Main resizable sidebar -->
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      :min-size="12"
      collapsible
      resizable
      class="relative bg-elevated/50"
    >
      <template #header="{ collapsed }">
        <div class="flex items-end gap-0.5 w-full">
          <NuxtLink to="/" class="flex items-end gap-0.5">
            <Logo class="h-8 w-auto shrink-0" />
            <span v-if="!collapsed" class="text-xl font-bold text-highlighted"
              >Chat</span
            >
          </NuxtLink>
          <div v-if="!collapsed" class="flex items-center gap-1.5 ms-auto">
            <UDashboardSearchButton collapsed />
          </div>
        </div>
        <UDashboardSidebarCollapse
          :collapsed="collapsed"
          class="absolute bottom-4 right-4 cursor-pointer"
        />
      </template>

      <template #default="{ collapsed }">
        <div class="flex h-full">
          <div class="flex-none flex flex-col items-center h-full">
            <UNavigationMenu
              :items="[
                { to: '/', icon: 'i-lucide-message-circle', label: 'Chats' },
                {
                  to: '/settings',
                  icon: 'i-lucide-sliders-horizontal',
                  label: 'Settings',
                },
                { to: '/notes', icon: 'i-lucide-pencil', label: 'Notes' },
                { to: '/files', icon: 'i-lucide-file', label: 'Files' },
                { to: '/library', icon: 'i-lucide-book', label: 'Library' },
                {
                  to: '/calendar',
                  icon: 'i-lucide-calendar-smile',
                  label: 'Calendar',
                },
              ]"
              orientation="vertical"
              :collapsed="true"
              :ui="{
                link: 'flex justify-center p-3 text-muted hover:text-primary',
                icon: 'w-6 h-6',
              }"
            />
          </div>
          <div class="flex-1 flex flex-col overflow-hidden">
            <div class="flex items-center space-x-4 p-2">
              <UButton
                v-bind="
                  collapsed ? { icon: 'i-lucide-plus' } : { label: 'New chat' }
                "
                variant="soft"
                block
                to="/"
                @click="open = false"
              />
            </div>
            <div class="flex-1 overflow-auto">
              <UNavigationMenu
                :items="items"
                :collapsed="collapsed"
                orientation="vertical"
                :ui="{ link: 'overflow-hidden' }"
              >
                <template #chat-trailing="{ item }">
                  <div
                    class="flex -mr-1.25 translate-x-full group-hover:translate-x-0 transition-transform"
                  >
                    <UButton
                      icon="i-lucide-x"
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      class="text-muted hover:text-primary hover:bg-accented/50 focus-visible:bg-accented/50 p-0.5"
                      tabindex="-1"
                      @click.stop.prevent="deleteChat((item as any).id)"
                    />
                  </div>
                </template>
              </UNavigationMenu>
            </div>
          </div>
        </div>
      </template>

      <template #footer="{ collapsed }">
        <UserMenu v-if="loggedIn" :collapsed="collapsed" />
        <UButton
          v-else
          :label="collapsed ? '' : 'Powered by Planom'"
          color="neutral"
          variant="ghost"
          class="w-full"
          @click="openInPopup('https://planomai.ir/')"
        >
          <template #icon>
            <img
              :src="planomLogo"
              alt="Planom Logo"
              class="w-5 h-5 object-contain"
            />
          </template>
        </UButton>
      </template>
    </UDashboardSidebar>

    <!-- Search overlay and content slot -->
    <UDashboardSearch
      placeholder="Search chats..."
      :groups="[
        {
          id: 'links',
          items: [{ label: 'New chat', to: '/', icon: 'i-lucide-square-pen' }],
        },
        ...groups,
      ]"
    />

    <slot />
  </UDashboardGroup>
</template>
