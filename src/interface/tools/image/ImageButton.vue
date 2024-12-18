<template>
    <ToolButton
        :title
        :icon
        :display
        :shortcut
        :active
        :disabled
        :editor
        :action="() => uploadDrawerOpened = true"
    />

	<v-drawer
		v-if="haveFilesAccess && !disabled"
		:model-value="uploadDrawerOpened"
		icon="image"
		:title="t('upload_from_device')"
		:cancelable="true"
		@update:model-value="uploadDrawerOpened = false"
		@cancel="uploadDrawerOpened = false"
	>
		<div class="uploader-drawer-content">
			<v-upload
				:ref="uploaderComponentElement"
				:multiple="false"
				:folder="folder"
				from-library
				from-url
				@input="handleFile"
			/>
		</div>
	</v-drawer>

</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useI18n } from 'vue-i18n';
    import { useApi, useStores } from '@directus/extensions-sdk';
    import type { CustomToolButtonProps } from "../../types";
    
    import ToolButton from "../../components/ToolButton.vue";
    import useDirectusToken from '../../composables/use-directus-token';
    
    const { t } = useI18n();

    const api = useApi();
    const { addTokenToURL } = useDirectusToken(api);
    
    const props = defineProps<CustomToolButtonProps>();

    const uploadDrawerOpened = ref(false);
    const uploaderComponentElement = ref<HTMLElement>();

    const { useCollectionsStore } = useStores();
    const collectionStore = useCollectionsStore();
    const haveFilesAccess = Boolean(collectionStore.getCollection('directus_files'));


    const handleFile = (file: FileInfo) => {
        const url = addTokenToURL( api.defaults.baseURL + 'assets/' + file.id);

        // { src: string, alt?: string, title?: string }
        props.editor.chain().focus().setImage({ src: url, alt: file.title, title: file.title }).run();

        uploadDrawerOpened.value = false;
    }

    type FileInfo = {
        id: string;
        title: string;
        type: string;
    };
</script>

<style scoped>
.uploader-drawer-content {
	padding: var(--content-padding);
	padding-top: 0;
	padding-bottom: var(--content-padding);
}
</style>