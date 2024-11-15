import { Bell, Lock, Eye, Globe, Moon } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import React from 'react';

export default function Settings() {
  return (
    <Layout>
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="grid gap-6">
        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Notifications
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage how you receive notifications.
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Push Notifications
                  </span>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Email Notifications
                  </span>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-rose-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    aria-hidden="true"
                    className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Privacy & Security
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your privacy settings and security preferences.
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Two-Factor Authentication
                  </span>
                </div>
                <button className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Profile Visibility
                  </span>
                </div>
                <select className="rounded-md border-gray-300 text-sm focus:border-rose-500 focus:ring-rose-500">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Friends Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Preferences
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Customize your app experience.
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Language
                  </span>
                </div>
                <select className="rounded-md border-gray-300 text-sm focus:border-rose-500 focus:ring-rose-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Dark Mode
                  </span>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Enable dark mode</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}